looker.plugins.visualizations.add({
    id: "servopa_homepage_v2",
    label: "Homepage",
    options: {
      
    },
    create: function(element, config) {
      element.innerHTML = `
        <style>
            #vis {
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
            }

            body {
                width: 100% !important;
            }

            .card:hover {
                scale: 1.05;
                transition: .2s ease;
                box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
            }
            
            .card {
                transition: .2s ease;
                cursor: pointer;
            }

            .home-container {
                width: 100%; 
                min-height: 100vh; 
                font-family: 'Montserrat', sans-serif; 
                background-image: url(https://kauantoldo.github.io/servopa_homepage_v2/fundo.png);
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
                display: flex;
            }

            #logo {
                width: 150px;
                position: absolute;
                top: 40px;
                right: 40px;
                filter: invert(1);
            }

            .titles-div {
                padding-left: 50px;
                margin-top: 80px;
            }

            .subtitle {
                font-size: 12px;
                margin: 0px;
                font-weight: normal;
                color: white;
            }

            .title {
                font-size: 32px;
                font-weight: bold;
                margin: 0;
                margin-top: 2px;
                color: white;
                text-transform: capitalize;
            }

            .cards-container {
                height: 100%;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 25px;
                color:rgb(206, 206, 206);
                padding-right: 50px;
                padding-left: 50px;
            }

            .body-page {
                display: flex;
                width: 100%;
                height: 100%;
                flex-direction: column;
            }

            .card {
                background-color: #ffffff; 
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
                border-radius: 12px; 
                width: 350px; 
                overflow: hidden; 
                cursor: pointer;
            }

            .card-img {
                width: 100%; 
                height: 200px; 
                object-fit: cover;
            }

            .card-info-div {
                padding: 20px; 
                text-align: center; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                gap: 5px;
            }

            .title-card {
                font-size: 18px; 
                font-weight: bold; 
                color: #333;
            }

            .icon-card {
                width: 25px;
                height: 25px;
            }

            .header-page {
                display: flex;
                gap: 20px;
                align-items: center;
                padding: 50px;
            }

            .search-container {
                display: flex;
                align-items: center;
                border: 1px solid #ccc;
                border-radius: 50px;
                overflow: hidden;
                width: 50%;
                padding: 5px 15px;
                margin-right: 30px;
                background-color: white;
            }
                
            .search-icon {
                width: 15px;
            }

            .search-input {
                border: none;
                outline: none;
                padding: 8px 12px;
                flex: 1;
                font-size: 14px;
            }

            .select-container {
                display: flex;
                align-items: center;
                border: 1px solid #ccc;
                border-radius: 25px;
                background-color: white;
                padding: 10px 20px;
                width: 250px;
                position: relative;
            }

            .folder-icon-select {
                width: 20px;
                height: 20px;
                margin-right: 8px;
            }

            .folder-select {
                border: none;
                outline: none;
                font-size: 14px;
                color:rgba(0, 0, 0, 0.5);
                flex: 1;
                background: white;;
            }

        </style>
        `

        this._tableContainer = element.appendChild(document.createElement("div"));
    },

    updateAsync: function(data, element, config, queryResponse, details, done) {
        this.clearErrors();
        this._tableContainer.innerHTML = "";
        const homeContainer = document.createElement('div');
        homeContainer.className = "home-container";


        // 1. Pega a chave do campo "Grupos Pasta"
        const foldersField = queryResponse.fields.dimension_like.find(f => f.label === "Grupos Pasta");
        // 2. Extrai os valores da dimensão
        let folders = data.map(row => row[foldersField.name].value);
        // Eliminar os duplicados
        folders = [...new Set(folders)];

        const body = document.createElement('div')
        body.classList = "body-page"

        const imgLogo = document.createElement('img')
        imgLogo.id = 'logo';
        imgLogo.src = "https://gruposervopa.com.br/themes/theme-grupo-servopa/assets/img/logos/servopa-grupo-branco.svg"

        const header = document.createElement('div')
        header.classList = "header-page"

        const titlesDiv = document.createElement("div")
        titlesDiv.className = "titles-div";

        const subtitle = document.createElement('h2');
        const title = document.createElement('h1');
        subtitle.classList = "subtitle";
        title.classList = "title";
        subtitle.textContent = "Olá, seja bem vindo(a) ao"
        title.textContent = `Painel ${data[0]["grupos.grupo"].value}`

        titlesDiv.appendChild(subtitle)
        titlesDiv.appendChild(title)

        body.appendChild(imgLogo)
        body.appendChild(titlesDiv)

        create_filter_folder();

        create_search_bar();

        body.appendChild(header)

        const cardsContainer = document.createElement('div');
        cardsContainer.classList = "cards-container";
        load_cards();
        body.appendChild(cardsContainer);

        homeContainer.appendChild(body)

        console.log(queryResponse)
        console.log(data)

        this._tableContainer.appendChild(homeContainer);
        done();

        function create_filter_folder() {
            const selectContainer = document.createElement('div');
            selectContainer.className = 'select-container';

            const folderIcon = document.createElement('img');
            folderIcon.src = "https://kauantoldo.github.io/servopa_homepage_v2/folder_icon.svg";
            folderIcon.className = 'folder-icon-select';
            selectContainer.appendChild(folderIcon);

            const select = document.createElement('select');
            select.className = 'folder-select';
            select.id = 'folder-select';

            const placeholderOption = document.createElement('option');
            placeholderOption.value = "Todas";
            placeholderOption.textContent = "Todos os paineis";
            placeholderOption.selected = true;

            select.appendChild(placeholderOption);

            folders.forEach(folder => {
                const option = document.createElement('option');
                option.value = folder;
                option.textContent = folder;
                select.appendChild(option);
            });

            select.addEventListener('change', () => {
                const selectedFolder = select.value;
                if (selectedFolder == "Todas") {
                    load_cards();
                } else {
                    load_cards(selectedFolder);
                }
            });

            selectContainer.appendChild(select);

            header.appendChild(selectContainer);

            select.addEventListener('focus', () => {
                selectContainer.style.border = '1px solid black';
            });

            // Quando perde o foco
            select.addEventListener('blur', () => {
                selectContainer.style.border = '1px solid #ccc';
            });
        }

        function load_cards(selectedFolder = null) {
            cardsContainer.innerHTML = "";  // limpa os cards anteriores

            let filteredRows;

            if (selectedFolder) {
                filteredRows = data.filter(row => row['grupos.pasta'].value === selectedFolder);
            } else {
                filteredRows = data;
            }

            if (filteredRows.length === 0) {
                cardsContainer.innerHTML = "Nenhum painel disponível.";
                return;
            }

            filteredRows.forEach((row, index) => {
                const card = document.createElement('div');
                card.classList = 'card';
                card.id = `card${index}`;

                const img = document.createElement('img');
                img.src = row['paineis.imagem'].value;
                img.alt = "Imagem do painel";
                img.classList = "card-img";

                const infoDiv = document.createElement('div');
                infoDiv.classList = 'card-info-div';

                const titleSpan = document.createElement('span');
                titleSpan.classList = 'title-card';
                titleSpan.textContent = row['paineis.painel'].value;

                const icon = document.createElement('img');
                icon.src = "https://cdn-icons-png.flaticon.com/512/5422/5422411.png";
                icon.classList = 'icon-card';
                icon.alt = "Redirecionar";

                infoDiv.appendChild(titleSpan);
                infoDiv.appendChild(icon);

                card.appendChild(img);
                card.appendChild(infoDiv);

                // Torna o card inteiro clicável
                card.addEventListener('click', function() {
                    window.open(row['paineis.link'].value, '_blank');
                });

                cardsContainer.appendChild(card);
            });
        }

        function create_search_bar() {
            const searchContainer = document.createElement('div');
            searchContainer.classList = 'search-container';

            const searchIcon = document.createElement('img');
            searchIcon.src = "https://cdn-icons-png.flaticon.com/512/622/622669.png"
            searchIcon.classList = 'search-icon';

            const searchInput = document.createElement('input');
            searchInput.classList = 'search-input';
            searchInput.type = 'text';
            searchInput.placeholder = 'Search';

            searchContainer.appendChild(searchIcon);
            searchContainer.appendChild(searchInput);

            header.appendChild(searchContainer);

            searchInput.addEventListener('focus', () => {
                searchContainer.style.border = '1px solid black';
            });

            // Quando perde o foco
            searchInput.addEventListener('blur', () => {
                searchContainer.style.border = '1px solid #ccc';
            });

            // Quando o usuário pressiona Enter
            searchInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    searchContainer.style.border = '1px solid #ccc';
                }
            });

            // Quando o usuário pressiona Enter
            searchInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    searchContainer.style.border = '1px solid #ccc';
                    const searchTerm = searchInput.value.trim().toLowerCase();

                    if (searchTerm === '') {
                        // Se a busca estiver vazia, mostra todos os cards
                        render_filtered_cards(data);
                    } else {
                        // Filtra apenas os painéis que possuem o termo no título
                        const filteredRows = data.filter(row =>
                            row['paineis.painel'].value.toLowerCase().includes(searchTerm)
                        );

                        render_filtered_cards(filteredRows);
                    }
                }
            });
        }

        function render_filtered_cards(filteredRows) {
            cardsContainer.innerHTML = "";  // limpa os cards anteriores

            title.textContent = `Resultados da busca`;

            if (filteredRows.length === 0) {
                cardsContainer.innerHTML = "Nenhum painel encontrado para esta busca.";
                return;
            }

            filteredRows.forEach((row, index) => {
                const card = document.createElement('div');
                card.classList = 'card';
                card.id = `card${index}`;

                const img = document.createElement('img');
                img.src = row['paineis.imagem'].value;
                img.alt = "Imagem do painel";
                img.classList = "card-img";

                const infoDiv = document.createElement('div');
                infoDiv.classList = 'card-info-div';

                const titleSpan = document.createElement('span');
                titleSpan.classList = 'title-card';
                titleSpan.textContent = row['paineis.painel'].value;

                const icon = document.createElement('img');
                icon.src = "https://cdn-icons-png.flaticon.com/512/5422/5422411.png";
                icon.classList = 'icon-card';
                icon.alt = "Redirecionar";

                infoDiv.appendChild(titleSpan);
                infoDiv.appendChild(icon);

                card.appendChild(img);
                card.appendChild(infoDiv);

                card.addEventListener('click', function() {
                    window.open(row['paineis.link'].value, '_blank');
                });

                cardsContainer.appendChild(card);
            });
        }

}});

