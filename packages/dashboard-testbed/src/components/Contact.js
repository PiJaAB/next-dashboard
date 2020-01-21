// @flow
import React, { useState, useRef } from 'react';

import { Modal } from '@pija-ab/next-dashboard';

const Contact = () => {
  const contactRef = useRef();
  const [active, setActive] = useState(false);
  const openContactModal = event => {
    event.preventDefault();
    setActive(true);
  };
  return (
    <div className="contact" ref={contactRef}>
      <button
        type="button"
        className="no-button contact-image"
        onClick={openContactModal}
      >
        <img src="/images/contact.png" alt="Anna Evesäter" />
      </button>
      <div className="contact-content">
        <button
          type="button"
          className="no-button color-text"
          onClick={openContactModal}
        >
          Contact
        </button>
      </div>
      <Modal
        id="contact"
        active={active}
        close={() => setActive(false)}
        title="Your primary contact"
        width="extra-narrow"
      >
        <div className="grid">
          <div className="cell column-4">
            <div className="contact-modal-image">
              <img src="/images/contact.png" alt="Anna Evesäter" />
            </div>
          </div>
          <div className="cell column-8">
            <h3>Anna Evesäter</h3>
            <div className="label margin-0">E-mail</div>
            <p className="margin-bottom-x1">
              <a href="mailto:xsuaa329@xzakt.com">xsuaa329@xzakt.com</a>
            </p>
            <div className="label margin-0">Phone</div>
            <p className="margin-bottom-x1">
              <a href="tel:+46 730-35 05 78">+46 730-35 05 78</a>
            </p>
            <p>
              <a href="#">Call on Skype</a>
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Contact;