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
            
            .menu-container {
                height: 100vh;
                width: 300px;
                background-color: #29479F;
                display: flex;
                flex-direction: column;
                align-items: center;
                position: sticky;
                top: 0;
            }

            #logo {
                width: 150px;
                margin-top: 40px
            }

            .list-folders {
                width: 100%;
                display: flex;
                flex-direction: column;
                padding: 0;
                margin: 0;
                margin-top: 80px;
            }

            .folder {
                color: white;
                cursor: pointer;
                font-size: 16px;
                list-style: none;
            }

            // .line {
            //     background-color:rgba(255, 255, 255, 0.4);
            //     height: 1px;
            //     width: 150px;
            //     margin-bottom: 30px;
            // }

            .folder-div {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 20px 30px;
                transition: .2s ease-in-out;
            }

            .folder-div:hover {
                background-color:rgb(29, 50, 112);
            }

            .titles-div {
                padding-left: 50px;
            }

            .subtitle {
                font-size: 12px;
                margin: 0px;
                font-weight: normal;
            }

            .title {
                font-size: 32px;
                font-weight: bold;
                margin: 0;
                margin-top: 2px;
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
                width: 300px; 
                overflow: hidden; 
                cursor: pointer;
            }

            .card-img {
                width: 100%; 
                height: 150px; 
                object-fit: cover;
            }

            .card-info-div {
                padding: 10px; 
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
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 50px;
                margin-bottom: 50px;
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

            .search-container:focus {
                border: 1px solid black;
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

        const header = document.createElement('div')
        header.classList = "header-page"

        const titlesDiv = document.createElement("div")
        titlesDiv.className = "titles-div";

        const subtitle = document.createElement('h2');
        const title = document.createElement('h1');
        subtitle.classList = "subtitle";
        title.classList = "title";
        subtitle.textContent = "Olá, seja bem vindo(a) ao"
        title.textContent = "Painel Geral"

        titlesDiv.appendChild(subtitle)
        titlesDiv.appendChild(title)

        header.appendChild(titlesDiv)

        create_search_bar();

        body.appendChild(header)

        const cardsContainer = document.createElement('div');
        cardsContainer.classList = "cards-container";
        cardsContainer.innerHTML = "Selecione uma pasta para visualizar o conteúdo";
        body.appendChild(cardsContainer);

        homeContainer.appendChild(body)


        console.log(queryResponse)
        console.log(data)

        this._tableContainer.appendChild(homeContainer);
        done();

        function create_menu() {
            const menuContainer = document.createElement('div');
            menuContainer.classList.add('menu-container');
            
            const logoImg = document.createElement('img')
            logoImg.src = "https://gruposervopa.com.br/themes/theme-grupo-servopa/assets/img/logos/servopa-grupo-branco.svg"
            logoImg.id = 'logo';
            menuContainer.appendChild(logoImg)

            const listFoldersDiv = document.createElement('ul');
            listFoldersDiv.classList = 'list-folders';
            
            folders.forEach(folder => {
                const folderDiv = document.createElement('div')
                folderDiv.classList = 'folder-div'

                const folderIcon = document.createElement('img')
                folderIcon.src = "https://kauantoldo.github.io/servopa_homepage/folder_icon.svg"
                folderIcon.classList = 'folder-icon'

                const li = document.createElement('li');
                li.textContent = folder;
                li.classList.add('folder')


                folderDiv.appendChild(folderIcon)
                folderDiv.appendChild(li);
                listFoldersDiv.appendChild(folderDiv);


                folderDiv.addEventListener('click', () => {
                    load_cards(folder);
                });

            });

            menuContainer.appendChild(listFoldersDiv);
            homeContainer.appendChild(menuContainer);
        }

        function load_cards(selectedFolder) {
            cardsContainer.innerHTML = "";  // limpa os cards anteriores

            const filteredRows = data.filter(row => row['grupos.pasta'].value === selectedFolder);

            title.textContent = `Painel de ${selectedFolder}`;

            if (filteredRows.length === 0) {
                cardsContainer.innerHTML = "Nenhum painel disponível para esta pasta.";
                return;
            }

            filteredRows.forEach((row, index) => {
                const card = document.createElement('div');
                card.classList = 'card';
                card.id = `card${index}`;

                const img = document.createElement('img');
                img.src = row['paineis.imagem'].value
                img.alt = "Imagem do painel";
                img.classList = "card-img";

                const infoDiv = document.createElement('div');
                infoDiv.classList = 'card-info-div';

                const titleSpan = document.createElement('span');
                titleSpan.classList = 'title-card'
                titleSpan.textContent = row['paineis.painel'].value;

                const icon = document.createElement('img');
                icon.src = "https://cdn-icons-png.flaticon.com/512/5422/5422411.png";
                icon.classList = 'icon-card'
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
        }

}});

