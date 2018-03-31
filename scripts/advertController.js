function createAd(e) {
    let parent = $(e.target).parent().parent();
    let title = parent.find('input[name=title]').val();
    let description = parent.find('textarea[name=description]').val();
    let publisher = sessionStorage.getItem('username');
    let datePublished = parent.find('input[name=datePublished]').val();
    let price = Number(parent.find('input[name=price]').val()).toFixed(2);
    let image = parent.find('input[name=image]').val();
    let dataObj = {title, description, publisher, datePublished, price, image};

    webApi.sendRequest('POST', webApi.ACTIONS.accessCollection, webApi.authHeaders.user, dataObj)
        .then(() => listAds().then(() => showInfo('Advert created.')))
        .catch(webApi.handleAjaxError);
}

function displayAds(ads) {
    let table = $('table');
    table.find('tr').each((idx, el) => {if(idx > 0) $(el).remove()});
    ads.forEach(ad => {
        let row = $(`<tr id="${ad._id}">`);
        let btnTd = $('<td id="buttons">');
        table.append(row);
        row.append($('<td></td>').text(ad.title));
        row.append($('<td></td>').text(ad.publisher));
        row.append($('<td></td>').text(ad.description));
        row.append($('<td></td>').text(ad.price));
        row.append($('<td></td>').text(ad.datePublished));
        row.append(btnTd);

        btnTd.append($(`<a href="#">[Read More]</a>`).on('click', {ad}, showAdDetails));

        if (ad._acl.creator === sessionStorage.getItem('userId')) {
            row.append(
                btnTd.append(
                    $(`<a href="#">[Delete]</a>`).on('click', deleteAd),
                    $(`<a href="#">[Edit]</a>`).on('click', {ad}, showAdToEdit)
                ));
        }

    });
}

function listAds() {
    return webApi.sendRequest('GET', webApi.ACTIONS.accessCollection, webApi.authHeaders.user)
        .then((res) => {
            showView('#viewAds');
            displayAds(res.reverse());
        })
        .catch(webApi.handleAjaxError);

}

function deleteAd(e) {
    let id = $(e.target).parent().parent().attr('id');
    webApi.sendRequest('DELETE', webApi.ACTIONS.accessCollection + '/' + id, webApi.authHeaders.user)
        .then(() =>{
            $(`tr[id="${id}"]`).remove();
            showInfo('Advert deleted.');
        })
        .catch(webApi.handleAjaxError);
}

function editAd() {
    let parent = $('#formEditAd');
    let id = parent.find('input[name="id"]').val();
    let publisher = parent.find('input[name="publisher"]').val();
    let title = parent.find('input[name="title"]').val();
    let description = parent.find('textarea[name="description"]').val();
    let datePublished = parent.find('input[name="datePublished"]').val();
    let price = parent.find('input[name="price"]').val();
    let image = parent.find('input[name="image"]').val();
    let dataObj = {title, description, publisher, datePublished, price, image};

    webApi.sendRequest('PUT', webApi.ACTIONS.accessCollection + '/' + id, webApi.authHeaders.user, dataObj)
        .then(() => listAds().then(() => showInfo('Edit Successful.')))
        .catch(webApi.handleAjaxError);
}