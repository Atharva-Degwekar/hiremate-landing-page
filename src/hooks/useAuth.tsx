import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Subscription = {
  plan: "free" | "pro" | "premium";
  status: "trialing" | "active" | "canceled";
  trial_ends_at: string | null;
  current_period_end: string | null;
  card_last4: string | null;
};

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: Subscription | null;
  isPremium: boolean;
  refreshSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const loadSub = async (uid: string) => {
    const { data } = await supabase
      .from("subscriptions")
      .select("plan,status,trial_ends_at,current_period_end,card_last4")
      .eq("user_id", uid)
      .maybeSingle();
    setSubscription((data as Subscription) ?? null);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => loadSub(sess.user.id), 0);
      } else {
        setSubscription(null);
      }
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadSub(s.user.id);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const isPremium =
    !!subscription &&
    (subscription.plan === "pro" || subscription.plan === "premium") &&
    ((subscription.status === "trialing" &&
      !!subscription.trial_ends_at &&
      new Date(subscription.trial_ends_at) > new Date()) ||
      subscription.status === "active");

  return (
    <Ctx.Provider
      value={{
        user,
        session,
        loading,
        subscription,
        isPremium,
        refreshSubscription: async () => {
          if (user) await loadSub(user.id);
        },
        signOut: async () => {
          await supabase.auth.signOut();
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
