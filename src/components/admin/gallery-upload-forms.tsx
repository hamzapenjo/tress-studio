"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
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
import { uploadImageToGallery } from "@/lib/gallery-upload";

const initialState: GalleryFormState = { status: "idle" };

export function GalleryUploadForms({ categories }: { categories: string[] }) {
  // --- Dodaj slike (multi) ---
  const [singleState, singleAction, singlePending] = useActionState(
    uploadSingleImage,
    initialState
  );
  const [singleFiles, setSingleFiles] = useState<File[]>([]);
  const [singleUploading, setSingleUploading] = useState(false);
  const singleFormRef = useRef<HTMLFormElement>(null);
  const singleWasPending = useRef(false);
  const [singleDropzoneKey, setSingleDropzoneKey] = useState(0);

  useEffect(() => {
    if (singleWasPending.current && !singlePending && singleState.status === "idle") {
      singleFormRef.current?.reset();
      setSingleFiles([]);
      setSingleDropzoneKey((k) => k + 1);
    }
    singleWasPending.current = singlePending;
  }, [singlePending, singleState]);

  async function handleSingleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const category = String(new FormData(e.currentTarget).get("category") ?? "");
    setSingleUploading(true);
    const urls = (await Promise.all(singleFiles.map(uploadImageToGallery))).filter(
      (u): u is string => Boolean(u)
    );
    setSingleUploading(false);
    startTransition(() => {
      singleAction({ urls, category });
    });
  }

  // --- Dodaj par (prije/poslije) ---
  const [pairState, pairAction, pairPending] = useActionState(
    uploadPairImages,
    initialState
  );
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [pairUploading, setPairUploading] = useState(false);
  const pairFormRef = useRef<HTMLFormElement>(null);
  const pairWasPending = useRef(false);
  const [pairDropzoneKey, setPairDropzoneKey] = useState(0);

  useEffect(() => {
    if (pairWasPending.current && !pairPending && pairState.status === "idle") {
      pairFormRef.current?.reset();
      setBeforeFile(null);
      setAfterFile(null);
      setPairDropzoneKey((k) => k + 1);
    }
    pairWasPending.current = pairPending;
  }, [pairPending, pairState]);

  async function handlePairSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const category = String(new FormData(e.currentTarget).get("category") ?? "");
    setPairUploading(true);
    const [beforeUrl, afterUrl] = await Promise.all([
      beforeFile ? uploadImageToGallery(beforeFile) : Promise.resolve(null),
      afterFile ? uploadImageToGallery(afterFile) : Promise.resolve(null),
    ]);
    setPairUploading(false);
    startTransition(() => {
      pairAction({ beforeUrl, afterUrl, category });
    });
  }

  // --- Dodaj frizuru ---
  const [lookState, lookAction, lookPending] = useActionState(
    createHairstyleLook,
    initialState
  );
  const [lookFile, setLookFile] = useState<File | null>(null);
  const [lookUploading, setLookUploading] = useState(false);
  const lookFormRef = useRef<HTMLFormElement>(null);
  const lookWasPending = useRef(false);
  const [lookDropzoneKey, setLookDropzoneKey] = useState(0);

  useEffect(() => {
    if (lookWasPending.current && !lookPending && lookState.status === "idle") {
      lookFormRef.current?.reset();
      setLookFile(null);
      setLookDropzoneKey((k) => k + 1);
    }
    lookWasPending.current = lookPending;
  }, [lookPending, lookState]);

  async function handleLookSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = String(new FormData(e.currentTarget).get("title") ?? "");
    setLookUploading(true);
    const imageUrl = lookFile ? await uploadImageToGallery(lookFile) : null;
    setLookUploading(false);
    startTransition(() => {
      lookAction({ title, imageUrl });
    });
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <form
        ref={singleFormRef}
        onSubmit={handleSingleSubmit}
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
          <ImageDropzone key={singleDropzoneKey} onFilesChange={setSingleFiles} />
        </div>
        {singleState.status === "error" && (
          <p className="text-sm text-wine">{singleState.message}</p>
        )}
        <button
          type="submit"
          disabled={singleUploading || singlePending}
          className={buttonPrimaryClass + " self-start"}
        >
          {singleUploading ? "Otpremanje..." : singlePending ? "Slanje..." : "Dodaj slike"}
        </button>
      </form>

      <form
        ref={pairFormRef}
        onSubmit={handlePairSubmit}
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
          <ImageDropzone
            key={`before-${pairDropzoneKey}`}
            multiple={false}
            onFilesChange={(files) => setBeforeFile(files[0] ?? null)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Slika &mdash; poslije</label>
          <ImageDropzone
            key={`after-${pairDropzoneKey}`}
            multiple={false}
            onFilesChange={(files) => setAfterFile(files[0] ?? null)}
          />
        </div>
        {pairState.status === "error" && (
          <p className="text-sm text-wine">{pairState.message}</p>
        )}
        <button
          type="submit"
          disabled={pairUploading || pairPending}
          className={buttonPrimaryClass + " self-start"}
        >
          {pairUploading ? "Otpremanje..." : pairPending ? "Slanje..." : "Dodaj par"}
        </button>
      </form>

      <form
        ref={lookFormRef}
        onSubmit={handleLookSubmit}
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
          <ImageDropzone
            key={lookDropzoneKey}
            multiple={false}
            onFilesChange={(files) => setLookFile(files[0] ?? null)}
          />
        </div>
        <p className="text-xs text-paper-dim">
          Slika je opciona - možete dodati naziv sad, a fotografiju naknadno.
        </p>
        {lookState.status === "error" && (
          <p className="text-sm text-wine">{lookState.message}</p>
        )}
        <button
          type="submit"
          disabled={lookUploading || lookPending}
          className={buttonPrimaryClass + " self-start"}
        >
          {lookUploading ? "Otpremanje..." : lookPending ? "Slanje..." : "Dodaj frizuru"}
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
