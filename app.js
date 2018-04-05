async function startApp() {
    // showMenuLinks();
    // showHomeView();
    loadTemplates()
        .then(() => {
            loadNavigationTemplate();
            loadHomeTemplate();
        })
        .catch(webApi.handleAjaxError);
}