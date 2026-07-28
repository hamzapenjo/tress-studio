import { createClient } from "@/lib/supabase/server";
import { ReviewForm } from "@/components/review-form";
import { linkDangerClass } from "@/components/admin/field-styles";
import { deleteReview } from "./actions";

export default async function AdminRecenzijePage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="mb-6 font-display text-2xl italic">Nova recenzija</h1>
        <ReviewForm />
      </div>

      <div>
        <h2 className="mb-4 font-mono text-xs tracking-[0.14em] text-paper-dim uppercase">
          Recenzije
        </h2>
        <div className="overflow-x-auto border border-paper/10">
          <table className="w-full text-left font-mono text-sm">
            <thead>
              <tr>
                <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                  Klijent
                </th>
                <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                  Ocjena
                </th>
                <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                  Tekst
                </th>
                <th className="border-b border-paper/10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {reviews?.map((review) => (
                <tr key={review.id} className="hover:bg-paper/[0.03]">
                  <td className="border-b border-paper/10 px-4 py-3">
                    {review.author_name}
                  </td>
                  <td className="border-b border-paper/10 px-4 py-3 text-brass">
                    {"★".repeat(review.rating)}
                    <span className="text-paper-dim">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </td>
                  <td className="border-b border-paper/10 px-4 py-3">{review.body}</td>
                  <td className="border-b border-paper/10 px-4 py-3">
                    <form action={deleteReview.bind(null, review.id)}>
                      <button type="submit" className={linkDangerClass}>
                        Obriši
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!reviews || reviews.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-paper-dim">
                    Nema recenzija.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
