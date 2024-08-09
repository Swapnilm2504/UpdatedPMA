import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Product } from '../product.models';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.scss'],
})
export class UserdetailsComponent implements OnInit {
  userdetails: Product[] = [];
  searchText!: string;
  paginatedUserDetails: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages!: number;
  pages: number[] = [];

  constructor(private _api: ApiService, private _router: Router) {}

  ngOnInit(): void {
    this.getproduct();
  }

  getproduct() {
    this._api.getProducts().subscribe(res => {
      this.userdetails = res;
      this.totalPages = Math.ceil(this.userdetails.length / this.itemsPerPage);
      this.filterAndPaginate();
    });
  }

  filterAndPaginate() {
    const filtered = this.userdetails.filter(product =>
      this.searchText ? 
        product.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        product.price.toString().includes(this.searchText) ||
        product.quantity.toString().includes(this.searchText) : 
        true
    );

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.updatePagination(filtered);
  }

  updatePagination(filtered: Product[]) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUserDetails = filtered.slice(startIndex, endIndex);

    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterAndPaginate();
    }
  }

  deleteproduct(id: number) {
    this._api.deleteProduct(id).subscribe(() => {
      alert("Deleted successfully");
      this.getproduct();
    });
  }

  editproduct(id: number) {
    this._router.navigate(['updateform', id]);
  }
}
