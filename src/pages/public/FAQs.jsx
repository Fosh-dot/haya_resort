import React, { useState } from "react";
import petSizeChart from "../../assets/haya/pet-size-chart.png";
import petsAllowedRoomChart from "../../assets/haya/pets-allowed-room-chart.png";
import "./FAQs.css";
export const faqSections = [
  // =====================================================
  // 1. GENERAL INFORMATION
  // =====================================================
  {
    title: "GENERAL INFORMATION",
    questions: [
      {
        question: "How to reserve/book?",
        answer: ["Click the 'BOOK NOW' button to book or reserve."],
      },
      {
        question: "Do you have free Wi-Fi in the resort?",
        answer: [
          "Yes, we have free Wi-Fi in the selected areas in the resort.",
        ],
      },
      {
        question: "Are you a pet-friendly resort?",
        answer: [
          "Yes, we are a pet-friendly resort. However, there are selected non-pet-friendly rooms. You may find this information in the Rooms Description in the Rooms tab.",
          "PET FEE:",
          "1st small-sized pet is free.",
          "2nd small/medium-sized pet is ₱800 per pet per night.",
          "Large-sized pet is ₱1,400 per pet per night.",
        ],
      },
      {
        question: "Do you accept Day Tours?",
        answer: ["No, we do not accept Day Tours."],
      },
      {
        question: "How much is the entrance fee?",
        answer: ["No entrance fee."],
      },
      {
        question: "Do you allow walk-ins?",
        answer: [
          "Yes, however, we cannot guarantee room availability. Make sure you confirm first by messaging on our Facebook page or calling our mobile number before going to the resort.",
        ],
      },
      {
        question: "Do you honor Senior Citizen / PWD discounts?",
        answer: [
          "Yes. However, please note that the discount is applicable to the Senior Citizen/PWD only and not per room basis.",
        ],
      },
      {
        question: "Do you allow guests to bring food and drinks?",
        answer: [
          "Yes, no corkage fee, except in the restaurant.",
          "If you bring a caterer, there will be a charge of ₱80 per guest per meal.",
        ],
      },
      {
        question: "Do you have a restaurant?",
        answer: [
          "Yes, we have a restaurant in the resort, and it is exclusive only to staying-in guests.",
        ],
      },
      {
        question:
          "Can we cook in the resort? Do you have a kitchen that we can use/rent?",
        answer: [
          "Yes, we have a common kitchen that you can use for free, subject to availability.",
          "We have Cabanas (kitchen and dining area) that you can rent for ₱1,600 per night for 15 persons, subject to availability.",
        ],
      },
      {
        question: "Is your resort beachfront?",
        answer: [
          "Yes, we are a beachfront resort with direct access to the beach.",
        ],
      },
      {
        question: "Do you have water activities in the resort?",
        answer: ["We do not offer any water activities in the resort for now."],
      },
      {
        question: "What is the maximum capacity of the resort?",
        answer: [
          "Our rooms can accommodate up to 60 adults, subject to change.",
        ],
      },
    ],
  },

  // =====================================================
  // 2. ROOM INFORMATION
  // =====================================================
  {
    title: "ROOM INFORMATION",
    questions: [
      {
        question: "What is your check-in and check-out time?",
        answer: ["Check-in is 1:30 PM and check-out is 11:00 AM."],
      },
      {
        question: "What are your modes of payment?",
        answer: [
          "We accept bank transfer and BDO bank deposit.",
          "We accept credit card payments. Conditions apply.",
        ],
      },
      {
        question: "Are toiletries provided?",
        answer: [
          "Shampoo, body wash, towels, and bathrobes are provided, except for the dental and vanity kits.",
        ],
      },
      {
        question: "What is the maximum capacity per room?",
        answer: [
          "Meria Standard — Good for 2 persons. Can add up to 1 extra person, adult or child only.",
          "Kala Standard / Deluxe — Good for 2 persons. Can add up to 2 extra persons, adult or child only.",
          "Yasmin Deluxe — Good for 2 persons. Can add up to 1 extra person, adult OR 2 extra person-children only.",
          "Villa Frangipani / Sola Villa — Good for 4 persons. Can add up to 2 extra persons, adult OR 4 extra person-children only.",
          "Allo Villa — Good for 6 persons. Can add up to 2 extra persons, adult.",
        ],
      },
      {
        question: "How much is the extra persons charge?",
        answer: [
          "₱1,500 per person per night for guests aged 9 years old and above, with breakfast and an extra bed.",
          "Free of charge when using an existing bed for the first child aged 0–8 years old in standard rooms and the second child aged 0–8 years old in deluxe rooms and villas, except Sola Villa.",
          "Extra bed charge is ₱1,500.",
        ],
      },
      {
        question: "How many extra beds can be added per room?",
        answer: [
          "Standard / Deluxe — Up to 1 extra bed only.",
          "Villa Frangipani / Allo Villa — Up to 2 extra beds per room.",
        ],
      },
    ],
  },

  // =====================================================
  // 3. REBOOKING / CANCELLATION POLICY
  // =====================================================
  {
    title: "REBOOKING / CANCELLATION POLICY",
    questions: [
      {
        question: "What is the rebooking policy?",
        answer: [
          "All requests for transfers or rebookings are subject to the approval and availability of the Haya Nature Resort Team.",
          "NON-REFUNDABLE PAYMENTS: Please note that all payments made for bookings are non-refundable.",
          "NOTIFICATION FOR DATE CHANGES: You can transfer your booking to a new date if you notify us in writing at least 15 days before your original check-in date. This helps you avoid penalties. All rebooking requests must be sent to hello@hayaresort.com.",
          "TRANSFER FEES:",
          "If you rebook within 90 days of your original check-in date, there is no transfer charge.",
          "If you rebook after 90 days from your original check-in date, a 30% rebooking fee will apply.",
          "ROOM UPGRADES: If your originally booked room isn't available on your new dates and an upgraded room is the only option, you will be charged the difference in room rate.",
          "PROVIDING NEW DATES: You must provide your new dates on the same day you submit your written notification. Failure to provide new dates will result in the forfeiture of your booking.",
          "ONE-TIME TRANSFER: Bookings can only be transferred once. Once your booking confirmation for the new dates is sent, no further changes to the date can be made.",
          "RATE ADJUSTMENTS: The new booking will be based on the prevailing room rates for your selected new dates. Please be aware that prices are subject to change without prior notice.",
          "PROMOTIONAL RATES: Transferred bookings are not valid with any ongoing promotions on the new dates.",
        ],
      },
      {
        question: "What is the cancellation policy?",
        answer: [
          "NO CANCELLATIONS: Haya Nature Resort does not allow or entertain any cancellations.",
          "SHORTENED STAYS (IN-HOUSE GUESTS): For guests already staying at the resort, there will be no refund, cancellation, or transfer if you shorten your stay.",
          "EXTRA PERSONS AND CONSUMABLES: Payments made for additional persons are non-refundable and cannot be credited towards other consumables or services.",
          "FORCE MAJEURE POLICY:",
          "We do not offer advance bookings or refunds in the event of force majeure circumstances.",
          "In such cases, we will provide a new booking once the situation has been resolved and approved by management.",
          "All decisions regarding bookings and rescheduling are subject to the discretion and approval of management.",
        ],
      },
    ],
  },

  // =====================================================
  // 4. PET POLICY
  // =====================================================
  {
    title: "PET POLICY",
    questions: [
      {
        question: "What are the pet size categories and fees?",
        answer: [
          "While in the resort, please be informed of the following.",
          "Our pet policy allows for the accommodation of one pet per guest. The first pet will be free of charge, and it should be in the SMALL size category.",
          "SMALL SIZE — Height of 30 centimeters (1 ft.) and 30 centimeters (1 ft.) long. Example: Shih Tzu/Chihuahua. The first small pet is free of charge; the second small pet will be charged ₱800.00.",
          "MEDIUM SIZE — Height more than 30 centimeters to 60 centimeters (2 ft.) and 60 centimeters (2 ft.) long. ₱800.00.",
          "LARGE SIZE — Height more than 60 centimeters (2 ft.) above. ₱1,400.00.",
        ],
      },
      {
        question: "Which rooms are pet-friendly?",
        answer: [
          "Non-pet-friendly rooms: Rooms 1, 2, 4, 16 and 19.",
          "Pet-friendly rooms: Rooms 3, 5, 6, 7, 8, 9, 10, 11, 12, 17, 18 and 20.",
        ],
      },
      {
        question: "What should pet owners bring?",
        answer: [
          "Pet owners should provide the following:",
          "Vaccination record",
          "Pet food and water bowls",
          "Pet leash",
          "Pet stroller/carrier",
          "Pet toys",
          "Disposable bags",
          "Pee pad",
          "Diapers",
          "If your cat is staying with you, you'll need to bring your own litter box.",
        ],
      },
      {
        question: "What are the pet leash requirements?",
        answer: [
          "Keep your pet leashed at all times when you need to leave your room and accompany your pet in public places at all times.",
        ],
      },
      {
        question: "Are pet vaccinations required?",
        answer: [
          "All pet vaccinations, especially anti-rabies, must be current and valid. The pet's vaccination certificate must be presented to the Front Desk upon check-in.",
        ],
      },
      {
        question: "Is there a security deposit for pets?",
        answer: [
          "The guest shall give a security deposit equivalent to Five hundred pesos (Php500.00) per pet in a room upon check-in.",
          "The security deposit will cover damages incurred, which may include but are not limited to stained bedding, stained carpet, stained linen, scratches on furniture, scratches on the floor, infestation, extra cleaning that may be required, and/or lost revenue charges while the unit is out of service due to cleaning and repairs.",
          "The room/s will be inspected upon check-out. After confirmation and clearance that no damage was found in the room and no extra cleaning efforts were required, the security deposit shall be returned.",
        ],
      },
      {
        question: "Can guests use resort equipment or linen for pets?",
        answer: [
          "All equipment required for the upkeep and feeding of pets is to be provided by the guest. Under no circumstances shall any equipment within the property be used for animal use. This includes the use of a hotel bathtub, available towels, and linen for your pets.",
          "Any use of linen for pets is to incur corresponding charges. Stained linen will be charged twice the regular laundry rate, while permanently stained linen will be charged a corresponding replacement fee.",
        ],
      },
      {
        question: "What happens if a pet is noisy or aggressive?",
        answer: [
          "Pet owners will be required to promptly address any complaints made by fellow guests regarding noise or any other disturbance caused by their pets.",
          "If any pet becomes overly disruptive or in any way aggressive towards other guests or employees, the pet must be removed from the property. If any pet is considered dangerous by Hotel Management, it shall immediately be removed from the property by the guest.",
        ],
      },
      {
        question: "What is the housekeeping policy for pets?",
        answer: [
          "During any housekeeping service, the guest is requested to remove their pet from the room. The guest may call the Housekeeping Department to arrange a convenient time to service the apartment.",
          "If housekeeping service is not required, the guest may activate the privacy sign in the room.",
        ],
      },
      {
        question: "What are the cleanliness requirements for pets?",
        answer: [
          "All pets must be clean, well-groomed, and completely free of fleas and ticks. Pets must wear diapers at all times, especially in public areas of the hotel.",
        ],
      },
      {
        question: "How should pet waste be disposed of?",
        answer: [
          "Pets are allowed to stay at the garden or lawn, if available, provided that their waste will be cleaned and disposed of by their owners in secured disposable bags. At all times, the guest shall maintain and keep the property in a good and sanitary condition.",
        ],
      },
      {
        question: "Can pets be left unattended?",
        answer: [
          "The guest agrees not to leave any pets unattended. Cats or dogs left unattended for a period of more than forty-eight (48) hours shall be considered abandoned and shall be reported to the proper authorities.",
          "The registered guest shall indemnify Hotel Management for any costs, losses, or damages which may result from such action being taken.",
        ],
      },
      {
        question: "Who pays for pet-related damages?",
        answer: [
          "Any damage caused by the pets shall be charged to the registered guest and must be paid immediately upon presentation of an invoice.",
        ],
      },
      {
        question: "Is the resort liable for pets' injuries or illnesses?",
        answer: [
          "The Hotel Management and its employees shall not be liable for any loss, injuries, or illness of any pet for any reason whatsoever.",
        ],
      },
      {
        question: "What happens if guests do not comply with the pet policy?",
        answer: [
          "The guest shall strictly comply with the Pet Policy Agreement and other rules and regulations issued by Hotel Management.",
          "Hotel Management reserves the right to require room changes, removal of pets from the property, or refuse or discontinue service without refund if, in the hotel's sole discretion, the pet is considered dangerous, unhealthy, or likely to frighten, harm, or disrupt hotel guests, has damaged hotel property, or has failed to abide by these policies.",
        ],
      },
      {
        question: "What are the pet owner's responsibilities?",
        answer: [
          "The guest accepts full responsibility for any and all liability, claims, losses, costs, and expenses, including reasonable attorney fees, for personal injury or property damage that may be caused by or attributed to their pets.",
          "The guest agrees to make any reimbursement for such damages on demand.",
        ],
      },
      {
        question: "What is the indemnification policy?",
        answer: [
          "The guest agrees to indemnify, hold harmless, and defend the Hotel Management, its owners, and employees from any and all liability, claims, losses, costs, and expenses, including reasonable attorney fees arising out of or relating to any claim for personal injury or property damage connected with their pets.",
        ],
      },
      {
        question: "Are there any pet health requirements before check-in?",
        answer: [
          "Pets should not have been sick in the last seventy-two (72) hours. A medical clearance from a certified veterinarian may be required upon check-in.",

          <div className="haya-faq-pet-images">
            <img
              src={petSizeChart}
              alt="Haya Nature Resort pet size and fee chart"
            />

            <img
              src={petsAllowedRoomChart}
              alt="Haya Nature Resort pets allowed by room chart"
            />
          </div>,
        ],
      },
    ],
  },
];
function FAQs() {
  const [openSection, setOpenSection] = useState(0);
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleSection = (index) => {
    setOpenSection((current) => (current === index ? -1 : index));
  };

  const toggleQuestion = (sectionIndex, questionIndex) => {
    const key = `${sectionIndex}-${questionIndex}`;

    setOpenQuestions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <main className="haya-faq-page">
      <header className="haya-faq-header">
        <h1>GOT ANY QUESTIONS?</h1>
        <p>Maybe these Frequently Asked Questions can help you out!</p>
      </header>

      <div className="haya-faq-search">
        <input
          type="search"
          placeholder="Looking for something?"
          onChange={(event) => {
            const search = event.target.value.toLowerCase();

            if (!search) {
              setOpenSection(0);
              setOpenQuestions({});
              return;
            }

            const matchingSection = faqSections.findIndex((section) =>
              section.questions.some(
                (item) =>
                  item.question.toLowerCase().includes(search) ||
                  item.answer.some(
                    (answer) =>
                      typeof answer === "string" &&
                      answer.toLowerCase().includes(search),
                  ),
              ),
            );

            if (matchingSection !== -1) {
              setOpenSection(matchingSection);
            }
          }}
        />
      </div>

      <div className="haya-faq-sections">
        {faqSections.map((section, sectionIndex) => (
          <section className="haya-faq-section" key={section.title}>
            <button
              type="button"
              className="haya-faq-section-toggle"
              onClick={() => toggleSection(sectionIndex)}
              aria-expanded={openSection === sectionIndex}
            >
              <span>{section.title}</span>
              <span className="haya-faq-chevron">
                {openSection === sectionIndex ? "⌃" : "⌄"}
              </span>
            </button>

            {openSection === sectionIndex && (
              <div className="haya-faq-questions">
                {section.questions.map((item, questionIndex) => {
                  const key = `${sectionIndex}-${questionIndex}`;
                  const isOpen = openQuestions[key] !== false;

                  return (
                    <article className="haya-faq-item" key={key}>
                      <button
                        type="button"
                        className="haya-faq-question"
                        onClick={() =>
                          toggleQuestion(sectionIndex, questionIndex)
                        }
                        aria-expanded={isOpen}
                      >
                        <span>{item.question}</span>
                        <span>{isOpen ? "−" : "+"}</span>
                      </button>

                      {isOpen && (
                        <div className="haya-faq-answer">
                          {item.answer.map((answer, answerIndex) => (
                            <div
                              className="haya-faq-answer-line"
                              key={answerIndex}
                            >
                              {typeof answer === "string" ? (
                                <p>{answer}</p>
                              ) : (
                                answer
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}

export default FAQs;
