import React, { useState, useEffect } from 'react';
import { GlassModal } from '../glass-panels/GlassModal';
import { useGraveyard } from '../../context/GraveyardContext';
import { ShieldCheck, Sparkles, GitFork, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ResurrectionRequestModal({ project, open, onClose, initialType = 'contribute' }) {
  const { activeProfile, submitRequest, isAuthenticated } = useGraveyard();
  const [requestType, setRequestType] = useState(
    initialType === 'adopt' && project?.allowAdoption ? 'adopt' : 'contribute'
  );
  const [message, setMessage] = useState('');
  const [availability, setAvailability] = useState(activeProfile.availability || '5-10 hrs/week');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !project) return;
    if (initialType === 'adopt' && project.allowAdoption) {
      setRequestType('adopt');
    } else if (project.acceptContributions !== false) {
      setRequestType('contribute');
    } else if (project.allowAdoption) {
      setRequestType('adopt');
    }
    setError('');
    setSent(false);
  }, [open, initialType, project]);

  if (!project) return null;

  const canContribute = project.acceptContributions !== false;
  const canAdopt = project.allowAdoption === true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (message.trim().length < 15) {
      setError('Please include a brief note (at least 15 characters) explaining how you plan to help.');
      return;
    }

    setSubmitting(true);
    const res = await submitRequest(project, {
      requestType,
      message,
      skills: activeProfile.skills,
      availability,
    });
    setSubmitting(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage('');
      onClose?.();
    }, 1350);
  };

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      subtitle="Permissioned Resurrection Protocol"
      title={`Request to Revive ${project.name}`}
      maxWidth="max-w-lg"
    >
      {sent ? (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#17663F]/40 bg-[#EAF5DC] text-[#17663F]">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h4 className="mt-4 font-display text-lg font-semibold text-[#181614]">
            Request Dispatched
          </h4>
          <p className="mt-2 max-w-sm text-sm text-[#5E584E]">
            Track approval status anytime inside your Dashboard under Requests.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="paper-manila rounded-2xl p-3.5 text-xs text-[#5E584E]">
            <div className="flex items-center gap-2 font-semibold text-[#181614]">
              <ShieldCheck className="h-4 w-4 text-[#17663F]" />
              <span>Creator Approval Policy: {project.collaborationModel}</span>
            </div>
            <p className="mt-1">
              Original creator ({project.creatorName}) retains ownership until they explicitly
              approve a collaboration or adoption request. No automatic ownership transfer occurs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!canContribute}
              onClick={() => setRequestType('contribute')}
              className={`rounded-2xl border p-3.5 text-left transition ${
                requestType === 'contribute'
                  ? 'border-[#17663F] bg-[#EAF5DC] text-[#181614]'
                  : 'border-[#181614]/15 bg-[#FAF7F0] text-[#5E584E] hover:border-[#181614]/30'
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Contribute</span>
                <Sparkles className="h-3.5 w-3.5 text-[#17663F]" />
              </div>
              <p className="mt-1 text-[11px]">
                {canContribute ? 'Tackle blockers or unfinished scope' : 'Closed by creator'}
              </p>
            </button>

            <button
              type="button"
              disabled={!canAdopt}
              onClick={() => setRequestType('adopt')}
              className={`rounded-2xl border p-3.5 text-left transition ${
                requestType === 'adopt'
                  ? 'border-[#1E4E8C] bg-[#E8EEF5] text-[#181614]'
                  : 'border-[#181614]/15 bg-[#FAF7F0] text-[#5E584E] hover:border-[#181614]/30'
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Adopt Project</span>
                <GitFork className="h-3.5 w-3.5 text-[#1E4E8C]" />
              </div>
              <p className="mt-1 text-[11px]">
                {canAdopt ? 'Request formal stewardship' : 'Adoption disabled'}
              </p>
            </button>
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
              Your Weekly Availability
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="paper-input w-full rounded-xl px-3.5 py-2.5 text-sm"
            >
              <option value="2-5 hrs/week">2-5 hrs/week (Steady fixes)</option>
              <option value="5-10 hrs/week">5-10 hrs/week (Active builder)</option>
              <option value="10+ hrs/week">10+ hrs/week (Lead revival)</option>
              <option value="Weekend sprint">Weekend sprint</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
              Revival Proposal
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Explain which blocker or unfinished feature in ${project.name} you want to tackle first...`}
              className="paper-input w-full rounded-2xl p-3.5 text-sm placeholder:text-[#5E584E]/60"
            />
          </div>

          {!isAuthenticated && (
            <p className="font-mono text-[11px] text-[#1E4E8C]">
              Demo Sandbox Mode: this request will persist locally in your browser. Sign in to send
              live requests via Supabase.
            </p>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-[#B4432C]/35 bg-[#F9EAE6] p-3 text-xs text-[#B4432C]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="paper-chip rounded-xl px-4 py-2.5 text-xs font-medium text-[#5E584E] hover:text-[#181614]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (!canContribute && !canAdopt)}
              className="rounded-xl bg-[#17663F] px-5 py-2.5 text-xs font-semibold text-[#FFFDF9] shadow-sm transition hover:bg-[#135333] disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send Resurrection Request'}
            </button>
          </div>
        </form>
      )}
    </GlassModal>
  );
}
