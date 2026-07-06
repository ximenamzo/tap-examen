import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  isEditMode = signal(false);
  isViewMode = signal(false);
  productId: string | null = null;

  name = '';
  brand = '';
  price: number | null = null;

  errorMessage = signal<string | null>(null);

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isViewMode.set(this.route.snapshot.queryParamMap.get('view') === 'true');

    if (this.productId) {
      this.isEditMode.set(true);
      this.productService.getOne(this.productId).subscribe((product) => {
        this.name = product.name;
        this.brand = product.brand;
        this.price = product.price;
      });
    }
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    if (this.price !== null && this.price.toString().length > 3) {
      this.errorMessage.set('El precio no puede tener más de 3 dígitos.');
      return;
    }

    const payload = { name: this.name, brand: this.brand, price: this.price! };

    const request$ = this.isEditMode()
      ? this.productService.update(this.productId!, payload)
      : this.productService.create(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/productos']),
      error: () => this.errorMessage.set('Ocurrió un error al guardar el producto.')
    });
  }
}