"use client";

import { useActionState } from "react";
import {
  uploadSingleImage,
  uploadPairImages,
  createHairstyleLook,
  type GalleryFormState,
} from "@/app/admin/(dashboard)/galerija/actions";
import {
  fieldClass,
  labelClass,
  buttonPrimaryClass,
} from "@/components/admin/field-styles";

const initialState: GalleryFormState = { status: "idle" };

export function GalleryUploadForms({ categories }: { categories: string[] }) {
  const [singleState, singleAction, singlePending] = useActionState(
    uploadSingleImage,
    initialState
  );
  const [pairState, pairAction, pairPending] = useActionState(
    uploadPairImages,
    initialState
  );
  const [lookState, lookAction, lookPending] = useActionState(
    createHairstyleLook,
    initialState
  );

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <form
        action={singleAction}
        className="flex flex-col gap-4 border border-paper/10 p-6"
      >
        <h2 className="font-mono text-xs tracking-[0.14em] text-paper-dim uppercase">
          Dodaj pojedinačnu sliku
        </h2>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Kategorija</label>
          <input
            type="text"
            name="category"
            list="gallery-categories"
            placeholder="npr. Frizure"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Slika</label>
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className={fieldClass}
          />
        </div>
        {singleState.status === "error" && (
          <p className="text-sm text-wine">{singleState.message}</p>
        )}
        <button
          type="submit"
          disabled={singlePending}
          className={buttonPrimaryClass + " self-start"}
        >
          {singlePending ? "Slanje..." : "Dodaj sliku"}
        </button>
      </form>

      <form
        action={pairAction}
        className="flex flex-col gap-4 border border-paper/10 p-6"
      >
        <h2 className="font-mono text-xs tracking-[0.14em] text-paper-dim uppercase">
          Dodaj par (prije / poslije)
        </h2>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Kategorija</label>
          <input
            type="text"
            name="category"
            list="gallery-categories"
            placeholder="npr. Bojanje"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Slika &mdash; prije</label>
          <input
            type="file"
            name="before"
            accept="image/*"
            required
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Slika &mdash; poslije</label>
          <input
            type="file"
            name="after"
            accept="image/*"
            required
            className={fieldClass}
          />
        </div>
        {pairState.status === "error" && (
          <p className="text-sm text-wine">{pairState.message}</p>
        )}
        <button
          type="submit"
          disabled={pairPending}
          className={buttonPrimaryClass + " self-start"}
        >
          {pairPending ? "Slanje..." : "Dodaj par"}
        </button>
      </form>

      <form
        action={lookAction}
        className="flex flex-col gap-4 border border-paper/10 p-6"
      >
        <h2 className="font-mono text-xs tracking-[0.14em] text-paper-dim uppercase">
          Dodaj frizuru (front/back/side)
        </h2>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Naziv frizure *</label>
          <input
            type="text"
            name="title"
            placeholder="npr. High Fade Buzz Cut"
            required
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Slika &mdash; sprijeda</label>
          <input type="file" name="front" accept="image/*" className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Slika &mdash; pozadi</label>
          <input type="file" name="back" accept="image/*" className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Slika &mdash; sa strane</label>
          <input type="file" name="side" accept="image/*" className={fieldClass} />
        </div>
        <p className="text-xs text-paper-dim">
          Slike su opcione - možete dodati naziv sad, a fotografije naknadno.
        </p>
        {lookState.status === "error" && (
          <p className="text-sm text-wine">{lookState.message}</p>
        )}
        <button
          type="submit"
          disabled={lookPending}
          className={buttonPrimaryClass + " self-start"}
        >
          {lookPending ? "Slanje..." : "Dodaj frizuru"}
        </button>
      </form>

      <datalist id="gallery-categories">
        {categories.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>
    </div>
  );
}
