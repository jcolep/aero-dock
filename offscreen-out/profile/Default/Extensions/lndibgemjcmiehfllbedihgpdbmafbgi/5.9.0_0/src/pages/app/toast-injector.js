(function () {
  function showToastError(title, message) {
    try {
      if (typeof window.$A !== 'undefined' && window.$A.get) {
        const toastEvent = window.$A.get('e.force:showToast');
        if (toastEvent) {
          toastEvent.setParams({
            title: title || 'Error',
            message: message || 'An error occurred.',
            type: 'error',
            mode: 'dismissible',
          });
          toastEvent.fire();
        } else {
          console.warn('Brobench: Toast event not available');
        }
      } else {
        console.warn('Brobench: window.$A is not ready');
      }
    } catch (e) {
      console.error('Brobench: Failed to show toast:', e);
    }
  }

  function navigateInLightning(url, fallbackURL) {
    try {
      if (!url) {
        return;
      }
      const navUrl = url.startsWith("/") ? url : "/" + url;
      if (
        (window.location.pathname || "").includes('/builder_platform_interaction/flowBuilder.app') ||
        navUrl.includes('/builder_platform_interaction/flowBuilder.app')
      ) {
        if (fallbackURL) {
          window.open(fallbackURL, '_top');
        } else {
          window.open(navUrl, '_top');
        }
        return;
      }

      if (fallbackURL && /\/analytics\b|\/tableau\b|AnalyticsStudio/i.test(window.location.pathname || '')) {
        window.open(fallbackURL, '_top');
        return;
      }

      if (typeof window.$A !== 'undefined' && window.$A.get) {
        const navEvent = window.$A.get('e.force:navigateToURL');
        if (navEvent) {
          navEvent.setParams({url: navUrl});
          navEvent.fire();
          return;
        }
      }

      if (window.sforce?.one?.navigateToURL) {
        window.sforce.one.navigateToURL(navUrl);
        return;
      }

      // Last resort: update URL without full reload and notify listeners.
      if (window.history?.pushState) {
        window.history.pushState({}, '', navUrl);
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
      }

      if (fallbackURL) {
        window.open(fallbackURL, '_top');
      }
    } catch (e) {
      console.error('Brobench: Failed lightning navigation:', e);
      if (fallbackURL) {
        window.open(fallbackURL, '_top');
      }
    }
  }

  function handleLightningNavigation(details) {
    try {
      if (!details) {
        return;
      }
      if (details.navigationType === "recordId" && details.recordId) {
        if (typeof window.$A !== 'undefined' && window.$A.get) {
          const e = window.$A.get('e.force:navigateToSObject');
          if (e) {
            e.setParams({recordId: details.recordId});
            e.fire();
            return;
          }
        }
      }
      if (details.navigationType === "url" && details.url) {
        navigateInLightning(details.url, details.fallbackURL);
      }
    } catch (e) {
      console.error('Brobench: handleLightningNavigation failed', e);
      if (details?.fallbackURL) {
        window.open(details.fallbackURL, '_top');
      }
    }
  }

  // Listen for custom events dispatched from content script context.
  function onLightningNavigateEvent(event) {
    const detail = event?.detail || {};
    navigateInLightning(detail.url, detail.fallbackURL);
  }
  document.addEventListener("bbLightningNavigate", onLightningNavigateEvent, true);
  window.addEventListener("bbLightningNavigate", onLightningNavigateEvent, true);
  document.addEventListener("lightningNavigate", (event) => {
    handleLightningNavigation(event?.detail || {});
  }, true);

  // Listen for messages from content script
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_SFDC_TOAST') {
      showToastError(event.data.title, event.data.message);
      return;
    }
    if (event.data && event.data.type === 'BB_LIGHTNING_NAVIGATE') {
      navigateInLightning(event.data.url, event.data.fallbackURL);
    }
  });
})();
