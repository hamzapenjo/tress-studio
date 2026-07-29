"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
import { ImageDropzone } from "@/components/admin/image-dropzone";

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

  const singleFormRef = useRef<HTMLFormElement>(null);
  const singleWasPending = useRef(false);
  const [singleDropzoneKey, setSingleDropzoneKey] = useState(0);

  useEffect(() => {
    if (singleWasPending.current && !singlePending && singleState.status === "idle") {
      singleFormRef.current?.reset();
      setSingleDropzoneKey((k) => k + 1);
    }
    singleWasPending.current = singlePending;
  }, [singlePending, singleState]);

  const pairFormRef = useRef<HTMLFormElement>(null);
  const pairWasPending = useRef(false);
  const [pairDropzoneKey, setPairDropzoneKey] = useState(0);

  useEffect(() => {
    if (pairWasPending.current && !pairPending && pairState.status === "idle") {
      pairFormRef.current?.reset();
      setPairDropzoneKey((k) => k + 1);
    }
    pairWasPending.current = pairPending;
  }, [pairPending, pairState]);

  const lookFormRef = useRef<HTMLFormElement>(null);
  const lookWasPending = useRef(false);
  const [lookDropzoneKey, setLookDropzoneKey] = useState(0);

  useEffect(() => {
    if (lookWasPending.current && !lookPending && lookState.status === "idle") {
      lookFormRef.current?.reset();
      setLookDropzoneKey((k) => k + 1);
    }
    lookWasPending.current = lookPending;
  }, [lookPending, lookState]);

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <form
        ref={singleFormRef}
        action={singleAction}
        className="flex flex-col gap-4 border border-paper/10 p-6"
      >
        <h2 className="font-mono text-xs tracking-[0.14em] text-paper-dim uppercase">
          Dodaj slike
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
          <label className={labelClass}>Slike (možete odabrati više odjednom)</label>
          <ImageDropzone key={singleDropzoneKey} name="files" />
        </div>
        {singleState.status === "error" && (
          <p className="text-sm text-wine">{singleState.message}</p>
        )}
        <button
          type="submit"
          disabled={singlePending}
          className={buttonPrimaryClass + " self-start"}
        >
          {singlePending ? "Slanje..." : "Dodaj slike"}
        </button>
      </form>

      <form
        ref={pairFormRef}
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
          <ImageDropzone key={`before-${pairDropzoneKey}`} name="before" multiple={false} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Slika &mdash; poslije</label>
          <ImageDropzone key={`after-${pairDropzoneKey}`} name="after" multiple={false} />
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
        ref={lookFormRef}
        action={lookAction}
        className="flex flex-col gap-4 border border-paper/10 p-6"
      >
        <h2 className="font-mono text-xs tracking-[0.14em] text-paper-dim uppercase">
          Dodaj frizuru
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
          <label className={labelClass}>Slika (front/back/side kolaž)</label>
          <ImageDropzone key={lookDropzoneKey} name="image" multiple={false} />
        </div>
        <p className="text-xs text-paper-dim">
          Slika je opciona - možete dodati naziv sad, a fotografiju naknadno.
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
