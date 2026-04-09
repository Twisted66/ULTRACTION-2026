# Palette's Journal

## 2026-02-14 - Standardizing Form Feedback and Accessibility
**Learning:** The contact form lacked clear visual indicators for mandatory fields and lacked immediate visual feedback during submission beyond text changes. Standardizing these (asterisks, legends, aria-describedby, and spinners) improves both accessibility and user confidence.
**Action:** Apply the asterisk/legend pattern for required fields and add a loading spinner to all async action buttons in future components.

## 2026-02-14 - Enhancing Navigation Awareness and Page Utility
**Learning:** Users often lose context of their location in single-page-looking multi-page sites without clear active navigation indicators. Additionally, long landing pages significantly benefit from a "Back to Top" utility to improve flow and reduce scroll fatigue.
**Action:** Always implement active state indicators in the main navigation and include a scroll-to-top utility for pages exceeding two screen heights.

## 2026-02-14 - Standardizing Form Feedback and Accessibility
**Learning:** Required fields should always have a visual indicator (*) and a visible legend. Semantic accessibility attributes like `aria-required` and `aria-describedby` are essential for screen reader users. Async operations like form submissions should use `aria-busy` and visual indicators like spinners rather than just changing text, ensuring the original button content remains accessible or clearly replaced.
**Action:** Implement the asterisk/legend pattern, use `aria-*` attributes for form fields, and use `aria-busy` with visual spinners for loading states.

## 2026-02-14 - Actionable Contact Information and High-Contrast Focus States
**Learning:** Standard text for phone numbers and emails lacks immediate utility on mobile and for assistive tech. Converting these to 'tel:' and 'mailto:' links significantly improves UX. Additionally, when using dark backgrounds (like a primary-colored footer), default focus outlines may have poor contrast; using the brand's accent color for 'focus-visible' ensures navigation remains accessible.
**Action:** Always wrap contact details in semantic action links and ensure focus rings use high-contrast colors (e.g., accent on primary) for all interactive footer elements.

## 2026-02-14 - Interactive Navigation Feedback and Component Extensibility
**Learning:** Mobile menu toggles that don't change their icon (e.g., staying as a hamburger when open) fail to provide immediate visual confirmation of the menu state. Additionally, internal UI components like 'MagneticButton' must support attribute spreading to allow developers to inject critical accessibility attributes (like aria-label) without modifying the base component.
**Action:** Ensure all toggle interactions have distinct visual states (icons/colors) and ensure all base UI components spread '...rest' props to their root interactive element.

## 2026-02-14 - Real-time Character Constraints and Visual Feedback
**Learning:** Textareas with character limits must feature a real-time counter linked via `aria-describedby` to ensure accessibility. Providing visual feedback, such as a color change (e.g., using the brand's accent color) when reaching 90% of the limit, significantly improves the user's ability to manage long inputs without trial-and-error. Programmatic value changes and form resets must also be explicitly handled to keep the UI counter in sync.
**Action:** Always include an accessible character counter for limited textareas and use distinct styling for nearing-limit states.

## 2026-04-09 - Interactive Scroll Indicators
**Learning:** Purely visual scroll indicators (like bouncing arrows) are missed opportunities for UX and accessibility. Converting them into anchor links with descriptive ARIA labels improves navigation for both keyboard and mouse users.
**Action:** Always wrap visual scroll hints in an anchor tag linking to the next logical section, and use Tailwind 'scroll-mt' to account for sticky headers.
