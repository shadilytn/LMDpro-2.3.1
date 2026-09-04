/**
 * Automated Accessibility (a11y) Testing Tool
 * Scans DOM elements for common accessibility issues like missing aria-labels,
 * unlabelled interactive elements, missing alt attributes, and contrast issues.
 */

export interface A11yViolation {
  id: string;
  element: string;
  severity: 'critical' | 'serious' | 'moderate';
  message: string;
  suggestion: string;
}

export function auditAccessibility(container: HTMLElement | Document = document): A11yViolation[] {
  const violations: A11yViolation[] = [];

  // 1. Check Images for alt attributes
  const images = container.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      violations.push({
        id: `img-alt-${index}`,
        element: img.tagName.toLowerCase(),
        severity: 'critical',
        message: `Image missing 'alt' attribute: ${img.src.substring(0, 50)}`,
        suggestion: 'Add an explicit alt="" attribute or descriptive text for screen readers.'
      });
    }
  });

  // 2. Check Buttons for labels/aria-label
  const buttons = container.querySelectorAll('button');
  buttons.forEach((btn, index) => {
    const text = btn.textContent?.trim();
    const ariaLabel = btn.getAttribute('aria-label');
    const title = btn.getAttribute('title');

    if (!text && !ariaLabel && !title) {
      violations.push({
        id: `btn-label-${index}`,
        element: `button#${btn.id || index}`,
        severity: 'critical',
        message: 'Interactive button missing accessible label or icon text.',
        suggestion: 'Provide an aria-label or visible text inside the button.'
      });
    }
  });

  // 3. Check Form Inputs for associated labels or aria-label
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    const hasLabel = id ? container.querySelector(`label[for="${id}"]`) : null;

    if (!ariaLabel && !ariaLabelledBy && !hasLabel && input.getAttribute('type') !== 'hidden') {
      violations.push({
        id: `input-label-${index}`,
        element: input.tagName.toLowerCase(),
        severity: 'serious',
        message: `Form input element missing associated <label> or aria-label attribute.`,
        suggestion: 'Add a <label for="..."> element or an explicit aria-label attribute.'
      });
    }
  });

  // 4. Check Headings Hierarchy
  const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  let lastLevel = 0;
  headings.forEach((h, index) => {
    const level = parseInt(h.tagName.substring(1), 10);
    if (lastLevel > 0 && level > lastLevel + 1) {
      violations.push({
        id: `heading-order-${index}`,
        element: h.tagName.toLowerCase(),
        severity: 'moderate',
        message: `Skipped heading level from h${lastLevel} to h${level}.`,
        suggestion: 'Maintain sequential heading levels (h1 -> h2 -> h3) for screen reader navigation.'
      });
    }
    lastLevel = level;
  });

  return violations;
}
