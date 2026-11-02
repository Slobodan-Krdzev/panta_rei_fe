import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { X } from "lucide-react";
import ContactList from "./ContactList.jsx";
import SocialButtons from "./SocialButtons.jsx";

const OpenContact = createContext(() => {});

// Any "Контакт" / "Закажете настап" button: opens the modal; without JavaScript it jumps to #booking
export function ContactButton({ className, children, onOpen }) {
  const open = useContext(OpenContact);
  return (
    <a
      className={className}
      href="#booking"
      onClick={(e) => {
        e.preventDefault();
        onOpen?.();
        open();
      }}
    >
      {children}
    </a>
  );
}

export function ContactProvider({ children }) {
  const dialogRef = useRef(null);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
  }, []);
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const dialog = dialogRef.current;
    const unlock = () => (document.documentElement.style.overflow = "");
    dialog.addEventListener("close", unlock);
    return () => dialog.removeEventListener("close", unlock);
  }, []);

  return (
    <OpenContact.Provider value={open}>
      {children}
      <dialog
        ref={dialogRef}
        className="contact-modal"
        aria-labelledby="contact-title"
        onClick={(e) => e.target === e.currentTarget && close()} // click on the dimmed backdrop
      >
        <div className="contact-panel">
          <div className="contact-head">
            <div>
              <p className="overline">Закажете настап</p>
              <h2 id="contact-title">Контакт</h2>
            </div>
            <button className="lightbox-close" type="button" onClick={close} aria-label="Затвори">
              <X aria-hidden="true" />
            </button>
          </div>
          <p className="contact-intro">Јавете се директно на некој од членовите на бендот.</p>
          <ContactList />
          <p className="contact-or">или пишете ни</p>
          <SocialButtons />
        </div>
      </dialog>
    </OpenContact.Provider>
  );
}
