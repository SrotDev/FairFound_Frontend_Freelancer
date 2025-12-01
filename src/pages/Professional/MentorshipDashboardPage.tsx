import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import {
  getMentorRequests,
  acceptMentorshipRequest,
  rejectMentorshipRequest,
  getRequestMessages,
  sendMessage as sendMessageApi,
} from "@/lib/endpoints/mentorship";

type BackendStatus = "pending" | "in_progress" | "completed" | "rejected";
interface MentorshipRequest {
  id: string;
  topic: string;
  details: string;
  status: BackendStatus;
  requester: string; // raw requester identifier
  requesterIdStr: string; // normalized string form for equality checks
  mentor?: string | null;
}
interface MessageEntry { id: string; text: string; sender: string; created_at: string }

const MentorshipDashboardPage = () => {
  const { user } = useAppContext();
  // Only use fields actually defined on `User` interface (id, email)
  const currentUserIdStr = user?.id ? String(user.id) : (user?.email ? String(user.email) : "");
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [filter, setFilter] = useState<BackendStatus | "all">("all");
  const [loading, setLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      // For 'pending' we want broader set, otherwise just mentor-assigned set
      if (filter === "pending") {
        const pending = await getMentorRequests("pending");
        setRequests(Array.isArray(pending) ? normalize(pending) : []);
      } else if (filter === "all") {
        const base = await getMentorRequests();
        const pending = await getMentorRequests("pending");
        const mergedMap: Record<string, MentorshipRequest> = {};
        normalize(base).concat(normalize(pending)).forEach((r) => (mergedMap[r.id] = r));
        setRequests(Object.values(mergedMap));
      } else {
        const data = await getMentorRequests(filter);
        setRequests(Array.isArray(data) ? normalize(data) : []);
      }
    } catch (e) {
      console.error("Failed to load mentorship requests", e);
    } finally {
      setLoading(false);
    }
  };

  const normalize = (items: any[]): MentorshipRequest[] =>
    items.map((r) => {
      const requesterValRaw = typeof r.requester === "object" ? (r.requester.id || r.requester.email) : r.requester;
      const mentorValRaw = typeof r.mentor === "object" ? (r.mentor?.id || r.mentor?.email) : r.mentor;
      const requesterIdStr = requesterValRaw !== undefined && requesterValRaw !== null ? String(requesterValRaw) : "";
      return {
        id: r.id,
        topic: r.topic,
        details: r.details || r.context || "",
        status: r.status as BackendStatus,
        requester: requesterValRaw,
        requesterIdStr,
        mentor: mentorValRaw,
      };
    });

  useEffect(() => {
    load();
  }, [filter]);

  const accept = async (id: string) => {
    try {
      await acceptMentorshipRequest(id);
      await load();
    } catch (e) {
      console.error("Accept failed", e);
    }
  };

  const decline = async (id: string) => {
    try {
      await rejectMentorshipRequest(id);
      // If active request rejected, clear chat
      if (activeRequestId === id) {
        setActiveRequestId(null);
        setMessages([]);
      }
      await load();
    } catch (e) {
      console.error("Reject failed", e);
    }
  };

  const loadMessages = async (id: string) => {
    setMsgLoading(true);
    try {
      const data = await getRequestMessages(id);
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Load messages failed", e);
    } finally {
      setMsgLoading(false);
    }
  };

  useEffect(() => {
    if (!activeRequestId) return;
    loadMessages(activeRequestId);
    const interval = setInterval(() => loadMessages(activeRequestId), 4000); // poll
    return () => clearInterval(interval);
  }, [activeRequestId]);

  const send = async () => {
    if (!activeRequestId || !chatInput.trim()) return;
    try {
      await sendMessageApi(activeRequestId, chatInput.trim());
      setChatInput("");
      await loadMessages(activeRequestId);
    } catch (e) {
      console.error("Send message failed", e);
    }
  };

  const filtered = requests; // Already filtered by load logic
  const currentThread = messages;

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Mentorship Requests (Professional)</h1>
          <p className="text-muted-foreground">View incoming requests and open chat after accepting.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-1">
            <h3 className="mb-4 text-lg font-semibold">Mentorship Requests</h3>
            <div className="mb-3 flex items-center gap-2 flex-wrap">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>All</Button>
              <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>Pending</Button>
              <Button variant={filter === "in_progress" ? "default" : "outline"} size="sm" onClick={() => setFilter("in_progress")}>In Progress</Button>
              <Button variant={filter === "rejected" ? "default" : "outline"} size="sm" onClick={() => setFilter("rejected")}>Rejected</Button>
              <Button variant={filter === "completed" ? "default" : "outline"} size="sm" onClick={() => setFilter("completed")}>Completed</Button>
            </div>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">No requests found.</p>
            ) : (
              <div className="space-y-3">
                {filtered.map((r) => (
                  <div key={r.id} className={`rounded-md border p-3 cursor-pointer ${activeRequestId === r.id ? "border-accent" : ""}`} onClick={() => setActiveRequestId(r.id)}>
                    <div className="mb-1 text-sm font-medium">{r.topic}</div>
                    <div className="text-xs text-muted-foreground">Status: {r.status}</div>
                    <div className="mt-2 text-xs line-clamp-3">{r.details}</div>
                    <div className="mt-3 flex gap-2 justify-end">
                      {r.status === "pending" && !r.mentor && r.requesterIdStr !== currentUserIdStr && (
                        <>
                          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); decline(r.id); }}>Reject</Button>
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); accept(r.id); }}>Accept</Button>
                        </>
                      )}
                      {r.status === "pending" && r.requesterIdStr === currentUserIdStr && (
                        <span className="text-xs text-muted-foreground">(Your request)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h3 className="mb-4 text-lg font-semibold">Chat Panel</h3>
            {!activeRequestId ? (
              <p className="text-sm text-muted-foreground">Select a request to view or send messages.</p>
            ) : (
              <>
                <div className="h-72 overflow-y-auto rounded-md border p-3 space-y-2 bg-muted/40">
                  {msgLoading ? (
                    <p className="text-sm text-muted-foreground">Loading messages…</p>
                  ) : messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No messages yet.</p>
                  ) : (
                    messages.map((m) => (
                      <div key={m.id} className={`max-w-[70%] rounded-md px-3 py-2 text-sm ${m.sender === "you" ? "bg-accent/20 ml-auto" : "bg-background border"}`}>{m.text}</div>
                    ))
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Input placeholder="Type a message" value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
                  <Button onClick={send}><Send className="mr-2 h-4 w-4" />Send</Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentorshipDashboardPage;
