((self) => {
    'use strict';

    const classes = {
        style: 'custom-style',
        wrapper: 'custom-wrapper',
        header: 'popup-header',
        headerLink: 'header-link',
        headerText: 'header-text',
        content: 'popup-content',
        nextArrow: 'next-arrow-element',
        prevArrow: 'prev-arrow-element',
        closeBtn: 'close-btn',
        itemRating: 'item-rating',
        roundBtn: 'round',
        itemWrapper: 'item-wrapper',
        imageBox: 'image-box',
        itemAttributes: 'item-attr-container',
        itemName: 'item-name',
        itemPriceContainer: 'item-price',
        itemRealPrice:'real-price',
        itemDiscountedPrice:'discounted-price',
    };

    let items = [];

    const selectors = Object.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${classes[key]}`, createdSelector
    ), {
        appendLocation: 'body',
    });

    self.init = async () => {
        self.reset();
        self.buildCSS();
        self.loadItems();
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        $(`${style}, ${wrapper}`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, closeBtn, itemRating, nextArrow, prevArrow, roundBtn, 
            itemWrapper, imageBox, itemAttributes, itemName, itemPriceContainer,itemRealPrice,itemDiscountedPrice ,content} = selectors;

        const customStyle =
            `${ wrapper } {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            background: white;
            max-width: 1000px;
            width: 100%;
            height: 500px;
            text-align: center;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border-radius: 12px;
            padding-top:20px;
            gap:20px;
        }
        ${ closeBtn } {
            position: absolute;
            z-index: 1;
            top: 12px;
            right: 12px;
            cursor: pointer;
        }
        ${ itemRating }::before {
            content: '★★★★★';
            letter-spacing: 4px;
            background: linear-gradient(90deg, gold calc(var(--item-rating) * 20%), #ccc calc(var(--item-rating) * 20%));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        ${ content } {
            overflow-x:hidden;
        }
        ${ wrapper } ul {
            display:flex;
            scroll-behavior: smooth;
            padding: 0;
            margin: 0;
            list-style: none;
            width: 100%;
            max-width:790px;
            gap:20px;
            transition: transform 0.3s ease;
        }
        ${ wrapper } ul::-webkit-scrollbar {
            display: none;
        }
        ${ wrapper } li {
            flex: 0 0 auto;
        }
        ${ imageBox }{
            background-color: #EAEFF3;
            background-size: cover;
            background-position: center;
            height: 250px;
            width: 250px;
        }
        ${ itemAttributes }{
            display: flex;
            flex-direction: column;
            gap: 30px;
        }
        ${ itemName }{
            font-weight:600;
        }
        ${ itemPriceContainer }{
            display: flex;
            justify-content: space-evenly;
        }
        ${ itemRealPrice }{
            text-decoration: line-through;
        }
        ${ wrapper } a {
            text-decoration: none;
            display: inline-block;
            padding: 8px 16px;
        }
        ${ wrapper } a:hover {
            background-color: #ddd;
            color: black;
        }
        ${ prevArrow } {
            background-color: #f1f1f1;
            color: black;
            left:5px;
            top:225px;
        }
        ${ nextArrow } {
            background-color: #f1f1f1;
            color: black;
            right:5px;
            top:225px;
        }
       ${ roundBtn } {
            position:absolute;
            z-index:1;
            border-radius: 50%;
        }
        @media screen and (max-width:991px){
            ${ wrapper } {
                width:80%;
            }
            ${ wrapper } ul {
                max-width:250px;
            }
        }
        `;

        $(`<style>`).addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const itemHTML = items.map(item => `
            <li>
                <div class="${ classes.itemWrapper }">
                    <div class="${ classes.imageBox }" style="background-image: url('${ item.imageUrl }');"></div>
                    <div class="${ classes.itemAttributes }">
                        <div class="${ classes.itemRating }" data-rating="${ item.rating }"></div>
                        <div class="${ classes.itemName }">${ item.name }</div>
                        <div class="${ classes.itemPriceContainer }">
                            <div class="${ classes.itemRealPrice }">${ item.realPrice }$</div>
                            <div class="${ classes.itemDiscountedPrice }">${ item.discountedPrice }$</div>
                        </div>
                    </div>
                </div>
            </li>
        `).join('');

        const outerHtml =
            `|<div class="${ classes.wrapper }">
                <div class="${ classes.header }">
                    <div class="${ classes.headerLink }">
                        <div class="${ classes.headerText }">Discounted Products</div>
                    </div>
                </div>
                <div class="${ classes.content }">
                        <ul>
                            ${ itemHTML }
                        </ul>
                </div>
                <a href ="#" class="${ classes.prevArrow } round">&#8249;</a>
                <a href ="#" class="${ classes.nextArrow } round">&#8250;</a>
                <div class="${ classes.closeBtn }">
                    <span>x</span>
                </div>
            </div>`;

        $(selectors.appendLocation).append(outerHtml);
    };

    self.setEvents = () => {
        const ratingElems = document.querySelectorAll(selectors.itemRating);
        ratingElems.forEach((ratingElem) => {
            const ratingValue = parseFloat(ratingElem.getAttribute("data-rating"));
            ratingElem.style.setProperty('--item-rating', ratingValue);
        });

        const prevArrow = $( selectors.prevArrow )
        const nextArrow = $( selectors.nextArrow )
        const carousel = document.querySelector(`${ selectors.content } ul`)
        const allItemCount = carousel.querySelectorAll('li').length;
        const gap = parseInt(getComputedStyle(carousel).gap);
        const scrollAmount = document.querySelector(`${ selectors.content } li`).offsetWidth + gap;

        let currentOffset = 0;

        prevArrow.on('click', (event) => {
            event.preventDefault();
            if (currentOffset > 0) {
                currentOffset -= scrollAmount;
                carousel.style.transform = `translateX(-${ currentOffset }px)`;
              }
        });

        let showedItemCount;
        if(window.innerWidth > 991) {
            showedItemCount = 3;
        } else {
            showedItemCount = 1;
        }
        nextArrow.on('click', (event) => {
            event.preventDefault();
            if(currentOffset < scrollAmount * (allItemCount - showedItemCount)){
                currentOffset += scrollAmount;
                carousel.style.transform = `translateX(-${ currentOffset }px)`
            }            
        });

        $(selectors.closeBtn).on('click', () => {
            $(selectors.wrapper).css('display', 'none');
        })
    };

    self.loadItems =  () => {
        fetch("../smart-recommender/data.json")
        .then(response => response.json())
        .then(data => {
            items = data.items
            self.buildHTML();
            self.setEvents();
        })
        .catch(error => {
            console.error(error)
        });
      
    };


    self.init();
})({});