import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

type RequestStatus = "pending" | "accepted" | "declined";
type MentorshipRequest = {
  id: string;
  name: string;
  topic: string;
  details: string;
  files: string[];
  status: RequestStatus;
  messages: Array<{ from: "mentee" | "pro"; text: string; ts: number }>;
};

// Read mentorship requests from localStorage (demo only)
function readRequests(): MentorshipRequest[] {
  try {
    const raw = localStorage.getItem("ff_mentorship_requests");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const MentorshipDashboardPage = () => {
  const [requests, setRequests] = useState<MentorshipRequest[]>(readRequests());
  const [acceptedId, setAcceptedId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [filter, setFilter] = useState<RequestStatus | "all">("all");

  useEffect(() => {
    const interval = setInterval(() => setRequests(readRequests()), 1500);
    return () => clearInterval(interval);
  }, []);

  const accept = (id: string) => {
    setAcceptedId(id);
    const next = requests.map((r) => (r.id === id ? { ...r, status: "accepted" as RequestStatus } : r));
    localStorage.setItem("ff_mentorship_requests", JSON.stringify(next));
    setRequests(next);
  };

  const decline = (id: string) => {
    const next = requests.map((r) => (r.id === id ? { ...r, status: "declined" as RequestStatus } : r));
    localStorage.setItem("ff_mentorship_requests", JSON.stringify(next));
    setRequests(next);
    if (acceptedId === id) setAcceptedId(null);
  };

  const send = () => {
    if (!acceptedId || !chatInput.trim()) return;
    const next = requests.map((r) =>
      r.id === acceptedId
        ? { ...r, messages: [...r.messages, { from: "pro" as const, text: chatInput, ts: Date.now() }] }
        : r
    );
    localStorage.setItem("ff_mentorship_requests", JSON.stringify(next));
    setRequests(next);
    setChatInput("");
  };

  const currentThread = acceptedId ? (requests.find((r) => r.id === acceptedId)?.messages || []) : [];
  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Mentorship Requests (Professional)</h1>
          <p className="text-muted-foreground">View incoming requests and open chat after accepting.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-1">
            <h3 className="mb-4 text-lg font-semibold">Incoming Requests</h3>
            <div className="mb-3 flex items-center gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>All</Button>
              <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>Pending</Button>
              <Button variant={filter === "accepted" ? "default" : "outline"} size="sm" onClick={() => setFilter("accepted")}>Accepted</Button>
              <Button variant={filter === "declined" ? "default" : "outline"} size="sm" onClick={() => setFilter("declined")}>Declined</Button>
            </div>
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground">No requests yet. This list updates automatically.</p>
              ) : (
                filtered.map((r) => (
                  <div key={r.id} className="rounded-md border p-3">
                    <div className="mb-1 text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.topic}</div>
                    <div className="text-xs mt-1">Status: {r.status}</div>
                    <div className="mt-2 text-xs line-clamp-3">{r.details}</div>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="outline" onClick={() => decline(r.id)}>Decline</Button>
                      <Button size="sm" onClick={() => accept(r.id)}>Accept</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h3 className="mb-4 text-lg font-semibold">Chat Panel</h3>
            {!acceptedId ? (
              <p className="text-sm text-muted-foreground">Select a request and click Accept to start chatting.</p>
            ) : (
              <>
                <div className="h-72 overflow-y-auto rounded-md border p-3 space-y-2 bg-muted/40">
                  {currentThread.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No messages yet. Start the conversation.</p>
                  ) : (
                    currentThread.map((m, idx) => (
                      <div key={idx} className={`max-w-[70%] rounded-md px-3 py-2 text-sm ${m.from === "pro" ? "bg-accent/20 ml-auto" : "bg-background border"}`}>{m.text}</div>
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
