"use client";

import { useState, useRef, useCallback, KeyboardEvent, useEffect } from "react";
import { Send, LayoutTemplate, CreditCard, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReplyQuote } from "./reply-quote";

interface ReplyDraft {
  /** Internal UUID of the message being replied to — sent back through onSend. */
  id: string;
  authorLabel: string;
  preview: string;
}

interface MessageComposerProps {
  conversationId: string;
  sessionExpired: boolean;
  onSend: (text: string, replyToId?: string) => void;
  onOpenTemplates: () => void;
  replyTo?: ReplyDraft | null;
  onClearReply?: () => void;
}

export function MessageComposer({
  conversationId,
  sessionExpired,
  onSend,
  onOpenTemplates,
  replyTo,
  onClearReply,
}: MessageComposerProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [showPaymentLink, setShowPaymentLink] = useState(false);
  const [payCurrency, setPayCurrency] = useState<"NGN"|"USD"|"GBP">("NGN");
  const [payAmount, setPayAmount] = useState("");
  const [payDesc, setPayDesc] = useState("");
  const [rates, setRates] = useState({ usd: 1500, gbp: 1900 });
  const [generatingLink, setGeneratingLink] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    supabase.from("global_settings").select("*").single().then(({ data }) => {
      if (data) setRates({ usd: data.usd_to_ngn_rate, gbp: data.gbp_to_ngn_rate });
    });
  }, [supabase]);

  const handleGeneratePaymentLink = async () => {
    if (!payAmount) return;
    setGeneratingLink(true);
    try {
      const res = await fetch("/api/paystack/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payAmount,
          currency: payCurrency,
          description: payDesc
        })
      });
      const data = await res.json();
      if (data.url) {
        setText((prev) => prev + (prev ? "\n" : "") + "Here is your secure payment link: " + data.url);
        setShowPaymentLink(false);
        setPayAmount("");
        setPayDesc("");
        adjustHeight();
      }
    } catch (err) {
      console.error("Failed to generate payment link", err);
    } finally {
      setGeneratingLink(false);
    }
  };

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    // Max 4 lines (~96px)
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, []);

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || sending || sessionExpired) return;

    setSending(true);
    try {
      onSend(trimmed, replyTo?.id);
      setText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } finally {
      setSending(false);
    }
  }, [text, sending, sessionExpired, onSend, replyTo?.id]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      adjustHeight();
    },
    [adjustHeight]
  );

  return (
    <div className="border-t border-slate-800 bg-slate-900 p-3">
      {replyTo && (
        <div className="mb-2">
          <ReplyQuote
            authorLabel={replyTo.authorLabel}
            preview={replyTo.preview}
            onDismiss={onClearReply}
          />
        </div>
      )}
      {sessionExpired && (
        <div className="mb-2 flex items-center justify-between rounded-lg bg-amber-500/10 px-3 py-2">
          <p className="text-xs text-amber-400">
            24-hour session expired. Use a template to re-engage.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-amber-400 hover:text-amber-300"
            onClick={onOpenTemplates}
          >
            <LayoutTemplate className="mr-1 h-3 w-3" />
            Templates
          </Button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 shrink-0 p-0 text-slate-400 hover:text-white"
          onClick={onOpenTemplates}
          title="Send template"
        >
          <LayoutTemplate className="h-4 w-4" />
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 shrink-0 p-0 text-slate-400 hover:text-white"
            onClick={() => setShowPaymentLink(!showPaymentLink)}
            title="Generate Payment Link"
          >
            <CreditCard className="h-4 w-4" />
          </Button>

          {showPaymentLink && (
            <div className="absolute bottom-full left-0 mb-2 w-72 bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl z-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-white">Payment Link</h4>
                <button onClick={() => setShowPaymentLink(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select 
                    value={payCurrency} 
                    onChange={e => setPayCurrency(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 text-sm text-white outline-none"
                  >
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <input 
                    type="number" 
                    placeholder="Amount" 
                    value={payAmount}
                    onChange={e => setPayAmount(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white outline-none"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Description (Optional)" 
                  value={payDesc}
                  onChange={e => setPayDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white outline-none"
                />
                
                {payAmount && payCurrency !== "NGN" && (
                  <div className="text-[10px] text-slate-400">
                    Customer will be charged in NGN (~₦{((parseFloat(payAmount) * (payCurrency === 'USD' ? rates.usd : rates.gbp)) + (payCurrency === 'USD' ? 10000 : 12000)).toLocaleString()})
                  </div>
                )}
                
                <Button 
                  onClick={handleGeneratePaymentLink} 
                  disabled={!payAmount || generatingLink}
                  className="w-full h-8 text-xs bg-primary hover:bg-primary/90"
                >
                  {generatingLink ? "Generating..." : "Insert Link"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            sessionExpired
              ? "Session expired - use a template"
              : "Type a message... (Shift+Enter for new line)"
          }
          disabled={sessionExpired}
          rows={1}
          className={cn(
            "flex-1 resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-primary/50",
            sessionExpired && "cursor-not-allowed opacity-50"
          )}
        />

        <Button
          size="sm"
          className="h-9 w-9 shrink-0 bg-primary p-0 hover:bg-primary/90 disabled:opacity-40"
          disabled={!text.trim() || sessionExpired || sending}
          onClick={handleSend}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Hint sits outside the flex row so its height doesn't push
          `items-end` buttons below the textarea. Indented to line up
          under the textarea left edge (w-9 button + gap-2 = 44px). */}
      <p className="mt-1 pl-11 text-[10px] text-slate-600">
        Type &apos;/&apos; for quick replies
      </p>
    </div>
  );
}
