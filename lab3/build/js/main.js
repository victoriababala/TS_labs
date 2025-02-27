"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class CatalogService {
    constructor() {
        this.homeHtml = "snippets/home.html";
        this.allCategoriesUrl = "data/catalog.json";
        this.categoriesTitleHtml = "snippets/categoriesTitle.html";
        this.categoryHtml = "snippets/categoryItem.html";
        this.catalogItemsUrl = "data/categs/";
        this.catalogItemsTitleHtml = "snippets/productTitle.html";
        this.catalogItemHtml = "snippets/productItem.html";
        document.addEventListener("DOMContentLoaded", () => {
            this.loadHome();
            this.addEventListeners();
        });
    }
    addEventListeners() {
        var _a, _b;
        (_a = document.getElementById("linkHome")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (event) => {
            event.preventDefault();
            this.loadHome();
        });
        (_b = document
            .getElementById("linkCategory")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (event) => {
            event.preventDefault();
            this.loadCatalogCategories();
        });
    }
    insertHtml(selector, html) {
        const targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    }
    showLoading(selector) {
        const html = '<div id="loader" class="loader"></div>';
        this.insertHtml(selector, html);
    }
    insertProperty(string, propName, propValue) {
        const propToReplace = `{{${propName}}}`;
        return string.replace(new RegExp(propToReplace, "g"), propValue);
    }
    loadHome() {
        return __awaiter(this, void 0, void 0, function* () {
            this.showLoading("#mainHome");
            const response = yield fetch(this.homeHtml);
            const responseText = yield response.text();
            this.switchHomeToActive();
            document.querySelector("#mainHome").innerHTML = responseText;
        });
    }
    loadCatalogCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            this.showLoading("#mainHome");
            const response = yield fetch(this.allCategoriesUrl);
            const categories = yield response.json();
            this.buildAndShowCategoriesHTML(categories);
        });
    }
    buildAndShowCategoriesHTML(categories) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoriesTitleHtml = yield this.fetchHtml(this.categoriesTitleHtml);
            const categoryHTML = yield this.fetchHtml(this.categoryHtml);
            this.switchCatalogToActive();
            const categoriesViewHtml = this.buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHTML);
            this.insertHtml("#mainHome", categoriesViewHtml);
        });
    }
    buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
        let finalHTML = categoriesTitleHtml;
        finalHTML += "<div class='container p-0'>";
        finalHTML += "<section class='row'>";
        for (const category of categories) {
            let html = categoryHtml;
            html = this.insertProperty(html, "name", category.name);
            html = this.insertProperty(html, "short_name", category.short_name);
            finalHTML += html;
        }
        finalHTML += "</section>";
        finalHTML += "</div>";
        return finalHTML;
    }
    loadCatalogItems(categoryShort) {
        return __awaiter(this, void 0, void 0, function* () {
            this.showLoading("#mainHome");
            const response = yield fetch(this.catalogItemsUrl + categoryShort + ".json");
            const categoryCatalogItems = yield response.json();
            this.buildAndShowCatalogItemsHTML(categoryCatalogItems);
        });
    }
    buildAndShowCatalogItemsHTML(categoryCatalogItems) {
        return __awaiter(this, void 0, void 0, function* () {
            const catalogItemTitleHtml = yield this.fetchHtml(this.catalogItemsTitleHtml);
            const catalogItemHtml = yield this.fetchHtml(this.catalogItemHtml);
            this.switchCatalogToActive();
            const catalogItemsViewHtml = this.buildCatalogItemsViewHtml(categoryCatalogItems, catalogItemTitleHtml, catalogItemHtml);
            this.insertHtml("#mainHome", catalogItemsViewHtml);
        });
    }
    buildCatalogItemsViewHtml(categoryCatalogItems, catalogItemsTitleHtml, catalogItemHtml) {
        let titleHtml = this.insertProperty(catalogItemsTitleHtml, "name", categoryCatalogItems.category.name);
        titleHtml = this.insertProperty(titleHtml, "special_instructions", categoryCatalogItems.category.special_instructions);
        let finalHtml = titleHtml;
        finalHtml += "<section class='row'>";
        for (const item of categoryCatalogItems.catalog_items) {
            let html = catalogItemHtml;
            html = this.insertProperty(html, "short_name", item.short_name);
            html = this.insertItemPrice(html, "price_retail", item.price_retail);
            html = this.insertItemAmount(html, "amount_retail", item.amount_retail);
            html = this.insertProperty(html, "name", item.name);
            html = this.insertProperty(html, "description", item.description);
            html = this.insertItemPrice(html, "price_wholesale", item.price_wholesale);
            html = this.insertItemAmount(html, "amount_wholesale", item.amount_wholesale);
            html = this.insertProperty(html, "catShort_name", categoryCatalogItems.category.short_name);
            finalHtml += html;
        }
        finalHtml += "</section>";
        return finalHtml;
    }
    insertItemPrice(html, pricePropName, priceValue) {
        const price = priceValue ? `$${priceValue.toFixed(2)}` : "";
        return this.insertProperty(html, pricePropName, price);
    }
    insertItemAmount(html, amountPropName, amountValue) {
        const amount = amountValue ? `(${amountValue})` : "";
        return this.insertProperty(html, amountPropName, amount);
    }
    fetchHtml(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url);
            return response.text();
        });
    }
    switchCatalogToActive() {
        this.toggleActiveClass("#linkHome", false);
        this.toggleActiveClass("#linkCategory", true);
    }
    switchHomeToActive() {
        this.toggleActiveClass("#linkCategory", false);
        this.toggleActiveClass("#linkHome", true);
    }
    toggleActiveClass(selector, isActive) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.toggle("active", isActive);
        }
    }
    loadSpecials() {
        return __awaiter(this, void 0, void 0, function* () {
            this.showLoading("#mainHome");
            const randomCategory = ["F1", "F2", "F3"][Math.floor(Math.random() * 3)];
            const response = yield fetch(this.catalogItemsUrl + randomCategory + ".json");
            const categoryCatalogItems = yield response.json();
            this.buildAndShowCatalogItemsHTML(categoryCatalogItems);
        });
    }
}
const catalogService = new CatalogService();
window.catalogService = catalogService;
