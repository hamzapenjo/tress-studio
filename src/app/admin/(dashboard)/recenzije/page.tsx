import { createClient } from "@/lib/supabase/server";
import { ReviewForm } from "@/components/review-form";
import { linkDangerClass, buttonPrimaryClass } from "@/components/admin/field-styles";
import { approveReview, deleteReview } from "./actions";
import { StarRating } from "@/components/star-rating";
import type { Database } from "@/lib/database.types";

type Review = Database["public"]["Tables"]["reviews"]["Row"];

function ReviewsTable({
  reviews,
  emptyLabel,
  showApprove,
}: {
  reviews: Review[];
  emptyLabel: string;
  showApprove?: boolean;
}) {
  return (
    <div className="overflow-x-auto border border-ink/10">
      <table className="w-full text-left font-mono text-sm">
        <thead>
          <tr>
            <th className="border-b border-ink/10 px-4 py-3 text-xs tracking-[0.06em] text-ink-dim uppercase">
              Klijent
            </th>
            <th className="border-b border-ink/10 px-4 py-3 text-xs tracking-[0.06em] text-ink-dim uppercase">
              Ocjena
            </th>
            <th className="border-b border-ink/10 px-4 py-3 text-xs tracking-[0.06em] text-ink-dim uppercase">
              Tekst
            </th>
            <th className="border-b border-ink/10 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id} className="hover:bg-ink/[0.03]">
              <td className="border-b border-ink/10 px-4 py-3">{review.author_name}</td>
              <td className="border-b border-ink/10 px-4 py-3">
                <StarRating rating={review.rating} className="text-ink-dim/30" />
              </td>
              <td className="border-b border-ink/10 px-4 py-3">{review.body}</td>
              <td className="border-b border-ink/10 px-4 py-3">
                <div className="flex gap-2">
                  {showApprove && (
                    <form action={approveReview.bind(null, review.id)}>
                      <button type="submit" className={buttonPrimaryClass}>
                        Odobri
                      </button>
                    </form>
                  )}
                  <form action={deleteReview.bind(null, review.id)}>
                    <button type="submit" className={linkDangerClass}>
                      Obriši
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
          {reviews.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-ink-dim">
                {emptyLabel}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminRecenzijePage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  const pending = (reviews ?? []).filter((r) => !r.approved);
  const approved = (reviews ?? []).filter((r) => r.approved);

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="mb-6 font-display text-2xl italic">Nova recenzija</h1>
        <ReviewForm />
      </div>

      <div data-testid="reviews-pending">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-mono text-xs tracking-[0.14em] text-ink-dim uppercase">
            Na čekanju
          </h2>
          {pending.length > 0 && (
            <span className="border border-brass/40 bg-brass/10 px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-brass uppercase">
              {pending.length} {pending.length === 1 ? "nova" : "novih"}
            </span>
          )}
        </div>
        <ReviewsTable
          reviews={pending}
          emptyLabel="Nema recenzija na čekanju."
          showApprove
        />
      </div>

      <div>
        <h2 className="mb-4 font-mono text-xs tracking-[0.14em] text-ink-dim uppercase">
          Objavljene recenzije
        </h2>
        <ReviewsTable reviews={approved} emptyLabel="Nema objavljenih recenzija." />
      </div>
    </div>
  );
}
