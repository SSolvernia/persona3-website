import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/react/carousel";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// One project, filed as an exhibit: a yellow tab, its first capture taped to
// the sheet, and the text beside it. Clicking the capture opens every capture
// of the project, one at a time, over the page.
export default function Exhibit({ exhibit: ex, index, t }) {
  const letter = LETTERS[index];
  const hostname = ex.href && new URL(ex.href).hostname;

  return (
    <li className="cv-exhibit">
      <span className="cv-sticker" aria-hidden="true">
        {t.exhibitLabel}<b>{letter}</b>
      </span>

      {ex.shots.length > 0 && (
        <Dialog>
          <DialogTrigger className="cv-shot" aria-label={`${t.ui.enlarge}: ${ex.name}`}>
            <img src={ex.shots[0]} alt="" loading="lazy" />
            <span className="cv-shot-count" aria-hidden="true">1 / {ex.shots.length}</span>
          </DialogTrigger>
          <DialogBackdrop className="cv-dialog-backdrop" />
          <DialogContent className="cv-dialog">
            <div className="cv-dialog-head">
              <span className="cv-sticker" aria-hidden="true">
                {t.exhibitLabel}<b>{letter}</b>
              </span>
              <DialogTitle className="cv-dialog-title">{ex.name}</DialogTitle>
              <DialogClose className="cv-btn cv-dialog-close">{t.ui.close}</DialogClose>
            </div>
            <DialogDescription className="cv-dialog-desc">{ex.description}</DialogDescription>

            <Carousel className="cv-carousel" aria-label={`${ex.name}: ${t.ui.captures}`}>
              <CarouselViewport className="cv-carousel-viewport">
                <CarouselContent className="cv-carousel-content">
                  {ex.shots.map((shot, i) => (
                    <CarouselItem className="cv-carousel-item" key={shot}>
                      <img src={shot} alt={`${ex.name}, ${t.ui.capture} ${i + 1}`} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </CarouselViewport>
              <div className="cv-carousel-controls">
                <CarouselPrevious className="cv-btn cv-carousel-step">← {t.ui.prev}</CarouselPrevious>
                <CarouselIndicatorGroup className="cv-carousel-dots" aria-label={t.ui.chooseCapture}>
                  {ex.shots.map((shot, i) => (
                    <CarouselIndicator
                      className="cv-carousel-dot"
                      key={shot}
                      page={i + 1}
                      aria-label={`${t.ui.capture} ${i + 1}`}
                    />
                  ))}
                </CarouselIndicatorGroup>
                <CarouselNext className="cv-btn cv-carousel-step">{t.ui.next} →</CarouselNext>
              </div>
            </Carousel>

            {ex.href && (
              <a className="cv-link" href={ex.href} target="_blank" rel="noopener noreferrer">
                {t.visit} {hostname} <span aria-hidden="true">↗</span>
              </a>
            )}
          </DialogContent>
        </Dialog>
      )}

      <div className="cv-exhibit-body">
        <h3 className="cv-h3 ln">
          <span className="visually-hidden">{t.exhibitLabel} {letter}: </span>
          {ex.name}
        </h3>
        <p className="cv-exhibit-group ln">{ex.group}</p>
        <p className="cv-prose ln">{ex.description}</p>
        {ex.href && (
          <a className="cv-link ln" href={ex.href} target="_blank" rel="noopener noreferrer">
            {t.visit} {hostname} <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </li>
  );
}
