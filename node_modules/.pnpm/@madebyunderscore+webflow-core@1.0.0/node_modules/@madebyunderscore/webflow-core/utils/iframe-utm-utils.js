// This function updates the iframe with UTM parameters.
// It retrieves UTM parameters from session storage and appends them to the iframe's URL.
// It takes an optional targetId argument to specify the iframe ID.
// If no ID is provided, it defaults to 'mf_iframe'.
// If the iframe is not found, it does nothing.

export function updateIframeWithUTM(targetId = 'mf_iframe') {
    const iframe = document.getElementById(targetId);
    if (!iframe) return;
  
    const storedUTM = sessionStorage.getItem('utmParams');
    if (storedUTM) {
      const utmParams = JSON.parse(storedUTM);
      const iframeUrl = new URL(iframe.src);
  
      Object.entries(utmParams).forEach(([key, value]) => {
        iframeUrl.searchParams.set(key, value);
      });
  
      iframe.src = iframeUrl.toString();
    }
  }