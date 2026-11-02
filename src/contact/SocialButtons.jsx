import { Camera, MessageCircle } from "lucide-react";
import { LINKS } from "../data.js";

export default function SocialButtons() {
  return (
    <div className="contact-social">
      <a href={LINKS.facebook} target="_blank" rel="noreferrer">
        <MessageCircle aria-hidden="true" /> Facebook
      </a>
      <a href={LINKS.instagram} target="_blank" rel="noreferrer">
        <Camera aria-hidden="true" /> Instagram
      </a>
    </div>
  );
}
