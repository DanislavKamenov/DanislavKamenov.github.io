function createAd(e) {
    let parent = $(e.target).parent().parent();
    let title = parent.find('input[name=title]').val();
    let description = parent.find('textarea[name=description]').val();
    let publisher = sessionStorage.getItem('username');
    let datePublished = parent.find('input[name=datePublished]').val();
    let price = Number(parent.find('input[name=price]').val()).toFixed(2);
    let dataObj = {title, description, publisher, datePublished, price};

    webApi.sendRequest('POST', `appdata/${webApi.APP_ID}/prodavachnik`, webApi.authHeaders.user, dataObj)
        .then(() => listAds().then(() => showInfo('Advert created.')))
        .catch(webApi.handleAjaxError);
}

function listAds() {
    return webApi.sendRequest('GET', `appdata/${webApi.APP_ID}/prodavachnik`, webApi.authHeaders.user)
        .then((res) => {
            showView('#viewAds');
            displayAds(res.reverse());
        })
        .catch(webApi.handleAjaxError);

}

function displayAds(ads) {
    let table = $('table');
    table.find('tr').each((idx, el) => {if(idx > 0) $(el).remove()});
    ads.forEach(ad => {
        let row = $(`<tr id="${ad._id}">`);
        table.append(row);
        row.append($('<td></td>').text(ad.title));
        row.append($('<td></td>').text(ad.publisher));
        row.append($('<td></td>').text(ad.description));
        row.append($('<td></td>').text(ad.price));
        row.append($('<td></td>').text(ad.datePublished));

        if (ad._acl.creator === sessionStorage.getItem('userId')) {
            row.append(
                $('<td></td>').append(
                    $(`<a href="#">[Delete]</a>`).on('click', deleteAd),
                    $(`<a href="#">[Edit]</a>`).on('click', {ad}, showBookToEdit)
                ));
        }
    });
}

function deleteAd(e) {
    let id = $(e.target).parent().parent().attr('id');
    webApi.sendRequest('DELETE', `appdata/${webApi.APP_ID}/prodavachnik/${id}`, webApi.authHeaders.user)
        .then(() =>{
            $(`tr[id="${id}"]`).remove();
            showInfo('Advert deleted.');
        })
        .catch(webApi.handleAjaxError)
}

function editBook() {
    let parent = $('#formEditAd');
    let id = parent.find('input[name="id"]').val();
    let publisher = parent.find('input[name="publisher"]').val();
    let title = parent.find('input[name="title"]').val();
    let description = parent.find('textarea[name="description"]').val();
    let datePublished = parent.find('input[name="datePublished"]').val();
    let price = parent.find('input[name="price"]').val();
    let dataObj = {title, description, publisher, datePublished, price};

    webApi.sendRequest('PUT', `appdata/${webApi.APP_ID}/prodavachnik/${id}`, webApi.authHeaders.user, dataObj)
    .then(() => {
        listAds();
        showInfo('Edit successful.');
    })
    .catch(webApi.handleAjaxError);
}