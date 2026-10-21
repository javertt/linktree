"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { volunteerPhotos } from "./photos";

export function VolunteerGallery() {
  const [active, setActive] = useState<number | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const lightboxPanel = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (active === null) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const close = () => {
      setActive(null);
      requestAnimationFrame(() => lastTrigger.current?.focus());
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft")
        setActive((index) =>
          index === null
            ? null
            : (index - 1 + volunteerPhotos.length) % volunteerPhotos.length,
        );
      if (event.key === "ArrowRight")
        setActive((index) =>
          index === null ? null : (index + 1) % volunteerPhotos.length,
        );
      if (event.key === "Tab") {
        const buttons = lightboxPanel.current?.querySelectorAll("button");
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  const close = () => {
    setActive(null);
    requestAnimationFrame(() => lastTrigger.current?.focus());
  };
  const photo = active === null ? null : volunteerPhotos[active];

  return (
    <>
      <div className="volunteer-gallery">
        {volunteerPhotos.map((item, index) => (
          <button
            className="volunteer-photo-card"
            key={item.id}
            type="button"
            onClick={(event) => {
              lastTrigger.current = event.currentTarget;
              setActive(index);
            }}
            aria-label={`Ampliar: ${item.title}`}
          >
            <span className="volunteer-photo-frame">
              <Image
                src={item.thumbnail}
                alt={item.alt}
                width={item.width}
                height={item.height}
                unoptimized
              />
            </span>
            <span className="volunteer-photo-info">
              <strong>{item.title}</strong>
              <span>
                {item.material ? "Material didático" : "Registro fotográfico"}
              </span>
            </span>
          </button>
        ))}
      </div>

      {photo && (
        <div
          className="volunteer-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada: ${photo.title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="volunteer-lightbox-panel" ref={lightboxPanel}>
            <button
              ref={closeButton}
              className="volunteer-lightbox-close"
              type="button"
              onClick={close}
              aria-label="Fechar foto"
            >
              <X size={22} />
            </button>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              unoptimized
              priority
            />
            <div className="volunteer-lightbox-caption">
              <button
                type="button"
                onClick={() =>
                  setActive((index) =>
                    index === null
                      ? null
                      : (index - 1 + volunteerPhotos.length) %
                        volunteerPhotos.length,
                  )
                }
                aria-label="Foto anterior"
              >
                <ChevronLeft size={22} />
              </button>
              <div>
                <strong>{photo.title}</strong>
                <p>{photo.caption}</p>
                <span>
                  {active! + 1} de {volunteerPhotos.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setActive((index) =>
                    index === null
                      ? null
                      : (index + 1) % volunteerPhotos.length,
                  )
                }
                aria-label="Próxima foto"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
