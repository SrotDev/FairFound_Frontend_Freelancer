import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";
import { Upload, Send, Paperclip } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  getMyMentorshipRequests,
  createMentorshipRequest,
  getMentorshipRequest,
  updateMentorshipRequest,
  sendMessage as sendMessageApi,
  getRequestMessages,
} from "@/lib/endpoints/mentorship";

// Lightweight mock: requests stored in localStorage to demo flow
type RequestStatus = "pending" | "accepted" | "declined";
type MentorshipRequest = {
  id: string; // UUID
  name?: string;
  topic: string;
  details: string;
  files: string[];
  status: RequestStatus;
  messages?: Array<{ from: "mentee" | "pro"; text: string; ts?: number }>;
};

function useMentorshipRequests() {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyMentorshipRequests();
      const normalized: MentorshipRequest[] = Array.isArray(data)
        ? data.map((r: any) => ({
            id: r.id || r.uuid || r.pk || String(r.id),
            name: r.name,
            topic: r.topic,
            details: r.details,
            files: r.files || [],
            status: (r.status || "pending") as RequestStatus,
            messages: r.messages || [],
          }))
        : [];
      setRequests(normalized);
    } catch (e) {
      console.error("Failed to load mentorship requests", e);
    } finally {
      setLoading(false);
    }
  };

  const addRequest = async (req: { name?: string; topic: string; details: string; files: string[] }) => {
    try {
      const created = await createMentorshipRequest(req);
      toast({ title: "Request submitted", description: "Your mentorship request is pending." });
      await load();
      return created;
    } catch (e) {
      console.error("Failed to submit request", e);
      toast({ title: "Submission failed", description: "Please try again.", variant: "destructive" });
    }
  };

  const appendMessage = async (id: string, msg: { from: "mentee" | "pro"; text: string }) => {
    try {
      await sendMessageApi(id, msg.text);
      await load();
    } catch (e) {
      console.error("Failed to send message", e);
      toast({ title: "Message failed", description: "Please try again.", variant: "destructive" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { requests, addRequest, appendMessage, loading, reload: load };
}

const MentorshipRequestPage = () => {
  const { user } = useAppContext();
  const { requests, addRequest, appendMessage, loading } = useMentorshipRequests();
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [chat, setChat] = useState<Array<{ from: "you" | "pro"; text: string }>>([]);

  // Load chat history from backend when selecting a request
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeRequestId) return;
      try {
        const msgs = await getRequestMessages(activeRequestId);
        const normalized = Array.isArray(msgs)
          ? msgs.map((m: any) => ({
              from: m.sender && (m.sender.id || m.sender.email) ? "pro" : "pro", // fallback
              text: m.text,
            }))
          : [];
        // If backend returns sender as id, map current user to "you"
        setChat(normalized);
      } catch (e) {
        console.error("Failed to load messages", e);
      }
    };
    loadMessages();
  }, [activeRequestId]);

  // Auto-refresh requests so mentee sees status changes and new messages
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem("ff_mentorship_requests");
        const next: MentorshipRequest[] = raw ? JSON.parse(raw) : [];
        // Only update if changed to avoid loops
        if (JSON.stringify(next) !== JSON.stringify(requests)) {
          // Replace local state by reloading page state via window event
          // Simple approach: setRequests is inside hook; rehydrate via storage event simulation
          // Directly set since we are in same component scope
          // @ts-ignore access internal state for demo
        }
      } catch {}
    }, 1500);
    return () => clearInterval(interval);
  }, [requests]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files;
    if (!f) return;
    const names = Array.from(f).map((file) => file.name);
    setFiles((prev) => [...prev, ...names]);
  };

  const submitRequest = async () => {
    if (!topic.trim() || !details.trim()) return;
    await addRequest({ name: user?.name || "Anonymous", topic, details, files });
    setTopic("");
    setDetails("");
    setFiles([]);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    setChat((prev) => [...prev, { from: "you", text: message }]);
    if (activeRequestId) appendMessage(activeRequestId, { from: "mentee", text: message });
    setMessage("");
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Request Human Mentorship</h1>
          <p className="text-muted-foreground">Describe your needs and upload supporting materials. A professional can accept and chat with you.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Request form */}
          <Card className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Topic</label>
              <Input placeholder="e.g., Improve Next.js performance" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Details</label>
              <Textarea placeholder="Explain your context, goals, and blockers" value={details} onChange={(e) => setDetails(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Upload (images/docs)</label>
              <div className="flex items-center gap-3">
                <Input type="file" multiple onChange={handleFileSelect} />
                <Button variant="secondary"><Upload className="mr-2 h-4 w-4" />Attach</Button>
              </div>
              {files.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {files.map((f, i) => (
                    <Badge key={i} variant="secondary" className="inline-flex items-center gap-1"><Paperclip className="h-3 w-3" />{f}</Badge>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={submitRequest}>Submit Request</Button>
          </Card>

          {/* Simple chat panel (local demo) */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Chat (once a pro accepts)</h3>
            {/* Request history & status */}
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-semibold">Your Requests</h4>
              <div className="space-y-2">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading requests…</p>
                ) : requests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No requests submitted yet.</p>
                ) : (
                  requests.map((r) => (
                    <button type="button" key={r.id} className={`w-full rounded-md border p-3 text-left ${activeRequestId === r.id ? "border-accent bg-accent/10" : "hover:bg-muted"}`} onClick={() => setActiveRequestId(r.id)} aria-label="Open chat">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{r.topic}</div>
                          <div className="text-xs text-muted-foreground">Status: {r.status}</div>
                        </div>
                        <span className="text-xs">Open chat</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
            <div className="h-64 overflow-y-auto rounded-md border p-3 space-y-2 bg-muted/40">
              {chat.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages yet. Your conversation will appear here.</p>
              ) : (
                chat.map((m, idx) => (
                  <div key={idx} className={`max-w-[70%] rounded-md px-3 py-2 text-sm ${m.from === "you" ? "bg-accent/20 ml-auto" : "bg-background border"}`}>{m.text}</div>
                ))
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Input placeholder="Type a message" value={message} onChange={(e) => setMessage(e.target.value)} />
              <Button onClick={sendMessage}><Send className="mr-2 h-4 w-4" />Send</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentorshipRequestPage;
