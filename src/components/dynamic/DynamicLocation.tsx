"use client";

import { motion } from "framer-motion";

interface BusinessInfo {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  hours: string; // JSON string
  socialMedia?: string; // JSON string
  mapEmbed?: string;
}

interface LocationData {
  title?: string;
  subtitle?: string;
  hoursTitle?: string;
  contactTitle?: string;
  directionsButtonText?: string;
}

interface DynamicLocationProps {
  data?: LocationData;
  businessInfo: BusinessInfo;
}

export default function DynamicLocation({
  data = {},
  businessInfo
}: DynamicLocationProps) {
  const title = data.title || "Come Find Us";
  const subtitle = data.subtitle || "Worth the trip, easy to find";
  const hoursTitle = data.hoursTitle || "Hours";
  const contactTitle = data.contactTitle || "Contact";
  const directionsButtonText = data.directionsButtonText || "Get Directions";

  const hours = JSON.parse(businessInfo.hours || "{}");
  const socialMedia = JSON.parse(businessInfo.socialMedia || "{}");

  return (
    <div id="location" className="mt-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl font-bold mb-3"
          style={{
            color: "#144663",
            fontFamily: '"adventures-unlimited", serif',
          }}
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg font-headline"
          style={{ color: "#144663", opacity: 0.7 }}
        >
          {subtitle}
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Google Maps with Overlay Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden shadow-lg relative"
          style={{ minHeight: "500px" }}
        >
          {businessInfo.mapEmbed ? (
            <div dangerouslySetInnerHTML={{ __html: businessInfo.mapEmbed }} className="w-full h-full" />
          ) : (
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2851.6847391089!2d-68.61259!3d45.36215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${encodeURIComponent(businessInfo.address + ' ' + businessInfo.city + ' ' + businessInfo.state + ' ' + businessInfo.zip)}!5e0!3m2!1sen!2sus!4v1234567890`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "500px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}

          {/* Address Overlay Card */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="backdrop-blur bg-white/80 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center sm:justify-between gap-4">
              <div className="text-center sm:text-left">
                <p
                  className="font-headline font-bold text-base"
                  style={{ color: "#144663" }}
                >
                  {businessInfo.address}
                </p>
                <p
                  className="font-headline text-base"
                  style={{ color: "#144663" }}
                >
                  {businessInfo.city}, {businessInfo.state} {businessInfo.zip}
                </p>
              </div>
              <button
                onClick={() =>
                  window.open(
                    `https://maps.google.com/?q=${encodeURIComponent(businessInfo.address + ' ' + businessInfo.city + ' ' + businessInfo.state + ' ' + businessInfo.zip)}`,
                    "_blank"
                  )
                }
                className="px-5 py-2.5 rounded-full font-bebas text-base tracking-wide hover:scale-105 transition-all whitespace-nowrap w-full sm:w-auto"
                style={{
                  backgroundColor: "#144663",
                  color: "white",
                }}
              >
                {directionsButtonText}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Hours & Contact */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center"
        >
          <div className="space-y-8">
            {/* Hours Section */}
            <div>
              <h3
                className="text-7xl font-bold mb-2"
                style={{
                  color: "#144663",
                  fontFamily: '"adventures-unlimited", serif',
                }}
              >
                {hoursTitle}
              </h3>
              <div className="space-y-2 font-headline text-lg">
                {Object.entries(hours).map(([day, time]) => (
                  <div
                    key={day}
                    className="flex justify-between"
                    style={{ color: "#144663" }}
                  >
                    <span>{day}</span>
                    <span className="font-headline">
                      {time as string}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-[#144663]/20"></div>

            {/* Contact Section */}
            <div>
              <h3
                className="text-7xl font-bold mb-6"
                style={{
                  color: "#144663",
                  fontFamily: '"adventures-unlimited", serif',
                }}
              >
                {contactTitle}
              </h3>
              <div className="space-y-2">
                <a
                  href={`tel:${businessInfo.phone}`}
                  className="block font-headline text-lg hover:opacity-70 transition-opacity"
                  style={{ color: "#144663" }}
                >
                  {businessInfo.phone}
                </a>
                <a
                  href={`mailto:${businessInfo.email}`}
                  className="block font-headline text-lg hover:opacity-70 transition-opacity"
                  style={{ color: "#144663" }}
                >
                  {businessInfo.email}
                </a>
                {Object.keys(socialMedia).length > 0 && (
                  <div className="flex gap-4 mt-6">
                    {Object.entries(socialMedia).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url as string}
                        className="font-headline text-base hover:opacity-70 transition-opacity capitalize"
                        style={{ color: "#144663" }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {platform}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}