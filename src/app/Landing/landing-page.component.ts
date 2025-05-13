import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  isScrolled = false;

  constructor() {}

  ngOnInit(): void {
    // Initialize any necessary functionality here
    this.animateOnScroll();
    this.initTimelineEffects();

    // Check if AOS is available and initialize it
    if (typeof (window as any).AOS !== 'undefined') {
      (window as any).AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        offset: 100,
      });
    }
  }

  // Listen for scroll events
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Check if the page is scrolled
    this.isScrolled = window.scrollY > 50;
    this.animateOnScroll();
  }

  // Animation on scroll function
  animateOnScroll() {
    const animatedElements = document.querySelectorAll(
      '.feature-card, .timeline-item, .testimonial-card, [data-aos]'
    );

    animatedElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('animate');

        // Add class for AOS fallback
        if (element.hasAttribute('data-aos')) {
          element.classList.add('aos-animate');
        }
      }
    });
  }

  // Initialize timeline hover effects
  initTimelineEffects() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        const number = item.querySelector('.timeline-number') as HTMLElement;
        const content = item.querySelector('.timeline-content') as HTMLElement;

        if (number) number.style.transform = 'scale(1.1)';
        if (content) content.style.transform = 'translateX(5px)';
      });

      item.addEventListener('mouseleave', () => {
        const number = item.querySelector('.timeline-number') as HTMLElement;
        const content = item.querySelector('.timeline-content') as HTMLElement;

        if (number) number.style.transform = 'scale(1)';
        if (content) content.style.transform = 'translateX(0)';
      });
    });
  }

  // Smooth scroll to section function
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Helper method to trigger timeline animation manually
  animateTimeline(): void {
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate');
        item.classList.add('aos-animate');
      }, 100 * index); // Stagger the animations
    });
  }
}
