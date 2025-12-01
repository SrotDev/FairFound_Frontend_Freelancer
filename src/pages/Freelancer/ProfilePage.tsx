import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { Edit, Mail, UserRound, Briefcase, Globe, LogOut, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { getProfile, updateProfile } from "@/lib/endpoints/freelancer";

const ProfilePage = () => {
  const { user, setUser, freelancerProfile, updateFreelancerProfile, calculatePseudoRanking } = useAppContext();
  const [name, setName] = React.useState(user?.name || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [hourlyRate, setHourlyRate] = React.useState<number>(freelancerProfile.hourlyRate);
  const [portfolioItems, setPortfolioItems] = React.useState<number>(freelancerProfile.portfolioItems);
  const [proposalSuccessRate, setProposalSuccessRate] = React.useState<number>(freelancerProfile.proposalSuccessRate);
  const [repeatClientsRate, setRepeatClientsRate] = React.useState<number>(freelancerProfile.repeatClientsRate);
  const { logout } = useAppContext();
  const navigate = useNavigate();
  const pseudoRanking = calculatePseudoRanking();

  // Pricing suggestion logic: base market median + adjustments
  const computePricingSuggestion = () => {
    const baseMedian = 55; // assumed general market median USD/hr
    const skillBonus = Math.min(freelancerProfile.skills.length * 2.5, 20); // breadth adds value
    const portfolioBonus = Math.min(portfolioItems * 1.2, 18);
    const repeatBonus = Math.min(repeatClientsRate * 0.25, 12); // loyalty indicator
    const rankingFactor = (pseudoRanking / 100) * 25; // scaling potential premium
    const raw = baseMedian + skillBonus + portfolioBonus + repeatBonus + rankingFactor;
    // Define a reasonable band around raw recommendation
    const suggestedMin = Math.round(raw * 0.9);
    const suggestedMax = Math.round(raw * 1.15);
    return { suggestedMin, suggestedMax, raw: Math.round(raw) };
  };

  const pricing = computePricingSuggestion();
  const applySuggestedRate = () => {
    setHourlyRate(pricing.raw);
  };

  // Load backend profile on mount
  React.useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        // Expect shape from backend; map safely
        if (data) {
          setName(data.name || user?.name || "");
          setEmail(data.email || user?.email || "");
          setHourlyRate(Number(data.hourly_rate ?? hourlyRate));
          setPortfolioItems(Number(data.portfolio_items ?? portfolioItems));
          setProposalSuccessRate(Number(data.proposal_success_rate ?? proposalSuccessRate));
          setRepeatClientsRate(Number(data.repeat_clients_rate ?? repeatClientsRate));
          if (Array.isArray(data.skills)) {
            updateFreelancerProfile({ skills: data.skills });
          }
        }
      } catch (e) {
        console.warn("Failed to fetch profile from backend", e);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveProfile = async () => {
    try {
      // Update local UI state
      if (user) setUser({ ...user, name, email });
      updateFreelancerProfile({ hourlyRate, portfolioItems, proposalSuccessRate, repeatClientsRate });
      // Persist to backend
      await updateProfile({
        name,
        email,
        hourly_rate: hourlyRate,
        portfolio_items: portfolioItems,
        proposal_success_rate: proposalSuccessRate,
        repeat_clients_rate: repeatClientsRate,
      });
      toast({ title: "Profile saved", description: "Your profile was updated." });
    } catch (e) {
      console.error("Profile save failed", e);
      toast({ title: "Save failed", description: "Could not update your profile.", variant: "destructive" });
    }
  };

  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const performLogout = () => {
    setUser(null);
    navigate("/");
    toast({
      title: "Logged out",
      description: "You have been signed out successfully.",
    });
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 lg:px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 text-3xl md:text-4xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">Manage your public details and key metrics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={saveProfile}>
            <Edit className="h-4 w-4" /> Save Changes
          </Button>
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <Button variant="destructive" onClick={() => setConfirmOpen(true)} className="gap-2">
              <LogOut onClick={logout} className="h-4 w-4" /> Logout
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive"/> Confirm Logout</DialogTitle>
                <DialogDescription>
                  Are you sure you want to log out? Any unsaved changes to your profile will be lost.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={performLogout}>Logout</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Layout refactor: main content + fixed width sidebar */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-6 max-w-3xl">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-xl font-bold text-accent">{user?.name?.charAt(0) || "U"}</span>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-semibold flex items-center gap-2">
                <UserRound className="h-5 w-5 text-muted-foreground" />
                <Input className="max-w-xs" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <Input className="max-w-sm" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Freelancer
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" /> Public profile available
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-4">
            <Card className="flex flex-col justify-between gap-3 rounded-xl border border-border/50 bg-muted/40 p-4 min-h-32">
              <div className="text-xs font-medium text-muted-foreground tracking-wide">HOURLY RATE</div>
              <div>
                <Input className="text-sm" type="number" min={0} value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} />
              </div>
            </Card>
            <Card className="flex flex-col justify-between gap-3 rounded-xl border border-border/50 bg-muted/40 p-4 min-h-32">
              <div className="text-xs font-medium text-muted-foreground tracking-wide">PORTFOLIO ITEMS</div>
              <div>
                <Input className="text-sm" type="number" min={0} value={portfolioItems} onChange={(e) => setPortfolioItems(Number(e.target.value))} />
              </div>
            </Card>
            <Card className="flex flex-col justify-between gap-3 rounded-xl border border-border/50 bg-muted/40 p-4 min-h-32">
              <div className="text-xs font-medium text-muted-foreground tracking-wide">PROPOSAL SUCCESS %</div>
              <div>
                <Input className="text-sm" type="number" min={0} max={100} value={proposalSuccessRate} onChange={(e) => setProposalSuccessRate(Number(e.target.value))} />
              </div>
            </Card>
            <Card className="flex flex-col justify-between gap-3 rounded-xl border border-border/50 bg-muted/40 p-4 min-h-32">
              <div className="text-xs font-medium text-muted-foreground tracking-wide">REPEAT CLIENTS %</div>
              <div>
                <Input className="text-sm" type="number" min={0} max={100} value={repeatClientsRate} onChange={(e) => setRepeatClientsRate(Number(e.target.value))} />
              </div>
            </Card>
          </div>
        </Card>
        {/* Moved Skills card from sidebar into main column */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {freelancerProfile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent"
              >
                {skill}
              </span>
            ))}
          </div>
        </Card>
        </div>

        <aside className="w-full lg:w-[380px] space-y-6">
        <Card className="p-6 space-y-6 sticky top-24">
          <h3 className="text-lg font-semibold">Pricing Suggestions</h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Suggested range based on your skills ({freelancerProfile.skills.length}), portfolio depth ({portfolioItems} items),
              repeat clients ({repeatClientsRate}%), and ranking ({pseudoRanking}/100).
            </p>
            <div className="grid gap-3 sm:grid-cols-3 text-sm">
              <div className="flex flex-col justify-center rounded-xl border border-border/50 bg-background p-4 min-h-24 shadow-sm">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Current</p>
                <p className="mt-1 text-xl font-bold">${hourlyRate}/hr</p>
              </div>
              <div className="flex flex-col justify-center rounded-xl border border-border/50 bg-success/5 p-4 min-h-24 shadow-sm">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Suggested Min</p>
                <p className="mt-1 text-xl font-bold text-success">${pricing.suggestedMin}/hr</p>
              </div>
              <div className="flex flex-col justify-center rounded-xl border border-border/50 bg-secondary/5 p-4 min-h-24 shadow-sm">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Suggested Max</p>
                <p className="mt-1 text-xl font-bold text-secondary">${pricing.suggestedMax}/hr</p>
              </div>
            </div>
            <div className="rounded-md bg-accent/10 p-4 text-xs leading-relaxed text-muted-foreground">
              <strong className="text-accent">How this is calculated:</strong> Starts at a market median (${55}/hr) then adds bonuses for skill breadth,
              portfolio size, repeat clients (retention), and your composite ranking signal. Consider setting your rate near ${pricing.raw}/hr (midpoint)
              and revisit after boosting proposal success.
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={applySuggestedRate}>Apply ${pricing.raw}/hr</Button>
              <Button variant="outline" onClick={() => setHourlyRate(pricing.suggestedMax)}>Use Max</Button>
            </div>
          </div>
        </Card>
        </aside>
      </div>
    </div>
  );
};

export default ProfilePage;