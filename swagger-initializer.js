window.onload = function() {
  //<editor-fold desc="Changeable Configuration Block">

  const getAuthorizedValue = (authorized, schemeName) => {
    if (!authorized) return "";

    // Swagger UI stores auth data in an Immutable.js map in most builds.
    if (typeof authorized.getIn === "function") {
      return (authorized.getIn([schemeName, "value"]) || "").toString().trim();
    }

    // Fallback for plain object shapes.
    return (authorized?.[schemeName]?.value || "").toString().trim();
  };

  const requestInterceptor = (req) => {
    const authSelectors = window.ui?.getSystem?.()?.authSelectors;
    const authorized = authSelectors?.authorized?.();

    const apiKey = getAuthorizedValue(authorized, "ApiKeyAuth");
    const jwt = getAuthorizedValue(authorized, "JwtAuth");

    req.headers = req.headers || {};

    if (apiKey) {
      req.headers["X-API-Key"] = apiKey;
    }

    if (jwt) {
      req.headers.Authorization = jwt;
    } else {
      delete req.headers.Authorization;
    }

    return req;
  };

  // the following lines will be replaced by docker/configurator, when it runs in a docker-container
  window.ui = SwaggerUIBundle({
    url: "openapi.yaml",
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    requestInterceptor,
    layout: "BaseLayout"
  });

  //</editor-fold>
};
