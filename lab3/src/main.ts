class CatalogService {
  private homeHtml = "snippets/home.html";
  private allCategoriesUrl = "data/catalog.json";
  private categoriesTitleHtml = "snippets/categoriesTitle.html";
  private categoryHtml = "snippets/categoryItem.html";
  private catalogItemsUrl = "data/categs/";
  private catalogItemsTitleHtml = "snippets/productTitle.html";
  private catalogItemHtml = "snippets/productItem.html";

  constructor() {
    document.addEventListener("DOMContentLoaded", () => {
      this.loadHome();
      this.addEventListeners();
    });
  }
  private addEventListeners(): void {
    document.getElementById("linkHome")?.addEventListener("click", (event) => {
      event.preventDefault();
      this.loadHome();
    });
    document
      .getElementById("linkCategory")
      ?.addEventListener("click", (event) => {
        event.preventDefault();
        this.loadCatalogCategories();
      });
  }
  private insertHtml(selector: string, html: string): void {
    const targetElem = document.querySelector(selector) as HTMLElement;
    targetElem.innerHTML = html;
  }

  private showLoading(selector: string): void {
    const html = '<div id="loader" class="loader"></div>';
    this.insertHtml(selector, html);
  }

  private insertProperty(
    string: string,
    propName: string,
    propValue: string
  ): string {
    const propToReplace = `{{${propName}}}`;
    return string.replace(new RegExp(propToReplace, "g"), propValue);
  }

  public async loadHome(): Promise<void> {
    this.showLoading("#mainHome");
    const response = await fetch(this.homeHtml);
    const responseText = await response.text();
    this.switchHomeToActive();
    document.querySelector("#mainHome")!.innerHTML = responseText;
  }

  public async loadCatalogCategories(): Promise<void> {
    this.showLoading("#mainHome");
    const response = await fetch(this.allCategoriesUrl);
    const categories = await response.json();
    this.buildAndShowCategoriesHTML(categories);
  }

  private async buildAndShowCategoriesHTML(categories: any): Promise<void> {
    const categoriesTitleHtml = await this.fetchHtml(this.categoriesTitleHtml);
    const categoryHTML = await this.fetchHtml(this.categoryHtml);

    this.switchCatalogToActive();
    const categoriesViewHtml = this.buildCategoriesViewHtml(
      categories,
      categoriesTitleHtml,
      categoryHTML
    );
    this.insertHtml("#mainHome", categoriesViewHtml);
  }

  private buildCategoriesViewHtml(
    categories: any[],
    categoriesTitleHtml: string,
    categoryHtml: string
  ): string {
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

  public async loadCatalogItems(categoryShort: string): Promise<void> {
    this.showLoading("#mainHome");
    const response = await fetch(
      this.catalogItemsUrl + categoryShort + ".json"
    );
    const categoryCatalogItems = await response.json();
    this.buildAndShowCatalogItemsHTML(categoryCatalogItems);
  }

  private async buildAndShowCatalogItemsHTML(
    categoryCatalogItems: any
  ): Promise<void> {
    const catalogItemTitleHtml = await this.fetchHtml(
      this.catalogItemsTitleHtml
    );
    const catalogItemHtml = await this.fetchHtml(this.catalogItemHtml);

    this.switchCatalogToActive();
    const catalogItemsViewHtml = this.buildCatalogItemsViewHtml(
      categoryCatalogItems,
      catalogItemTitleHtml,
      catalogItemHtml
    );
    this.insertHtml("#mainHome", catalogItemsViewHtml);
  }

  private buildCatalogItemsViewHtml(
    categoryCatalogItems: any,
    catalogItemsTitleHtml: string,
    catalogItemHtml: string
  ): string {
    let titleHtml = this.insertProperty(
      catalogItemsTitleHtml,
      "name",
      categoryCatalogItems.category.name
    );

    titleHtml = this.insertProperty(
      titleHtml,
      "special_instructions",
      categoryCatalogItems.category.special_instructions
    );

    let finalHtml = titleHtml;
    finalHtml += "<section class='row'>";

    for (const item of categoryCatalogItems.catalog_items) {
      let html = catalogItemHtml;
      html = this.insertProperty(html, "short_name", item.short_name);
      html = this.insertItemPrice(html, "price_retail", item.price_retail);
      html = this.insertItemAmount(html, "amount_retail", item.amount_retail);
      html = this.insertProperty(html, "name", item.name);
      html = this.insertProperty(html, "description", item.description);
      html = this.insertItemPrice(
        html,
        "price_wholesale",
        item.price_wholesale
      );
      html = this.insertItemAmount(
        html,
        "amount_wholesale",
        item.amount_wholesale
      );
      html = this.insertProperty(
        html,
        "catShort_name",
        categoryCatalogItems.category.short_name
      );
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  private insertItemPrice(
    html: string,
    pricePropName: string,
    priceValue: number
  ): string {
    const price = priceValue ? `$${priceValue.toFixed(2)}` : "";
    return this.insertProperty(html, pricePropName, price);
  }

  private insertItemAmount(
    html: string,
    amountPropName: string,
    amountValue: string
  ): string {
    const amount = amountValue ? `(${amountValue})` : "";
    return this.insertProperty(html, amountPropName, amount);
  }

  private async fetchHtml(url: string): Promise<string> {
    const response = await fetch(url);
    return response.text();
  }

  private switchCatalogToActive(): void {
    this.toggleActiveClass("#linkHome", false);
    this.toggleActiveClass("#linkCategory", true);
  }

  private switchHomeToActive(): void {
    this.toggleActiveClass("#linkCategory", false);
    this.toggleActiveClass("#linkHome", true);
  }

  private toggleActiveClass(selector: string, isActive: boolean): void {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.toggle("active", isActive);
    }
  }

  public async loadSpecials(): Promise<void> {
    this.showLoading("#mainHome");
    const randomCategory = ["F1", "F2", "F3"][Math.floor(Math.random() * 3)];
    const response = await fetch(
      this.catalogItemsUrl + randomCategory + ".json"
    );
    const categoryCatalogItems = await response.json();
    this.buildAndShowCatalogItemsHTML(categoryCatalogItems);
  }
}
const catalogService = new CatalogService();
(window as any).catalogService = catalogService;
