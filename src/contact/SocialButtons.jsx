import { Camera, Mail, MessageCircle, Play } from "lucide-react";
import { EMAIL, LINKS } from "../data.js";

// Email + social networks; used in the contact modal and the booking section
export default function SocialButtons() {
  return (
    <div className="contact-social">
      <a href={`mailto:${EMAIL}`}>
        <Mail aria-hidden="true" /> {EMAIL}
      </a>
      <a href={LINKS.facebook} target="_blank" rel="noreferrer">
        <MessageCircle aria-hidden="true" /> Facebook
      </a>
      <a href={LINKS.instagram} target="_blank" rel="noreferrer">
        <Camera aria-hidden="true" /> Instagram
      </a>
      <a href={LINKS.youtube} target="_blank" rel="noreferrer">
        <Play aria-hidden="true" /> YouTube
      </a>
    </div>
  );
}
