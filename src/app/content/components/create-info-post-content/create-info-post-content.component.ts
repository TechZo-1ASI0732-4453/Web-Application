import {Component, effect, inject, input, Input, OnInit, Signal, WritableSignal} from '@angular/core'
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatSelectModule } from '@angular/material/select'
import { MatIconModule } from '@angular/material/icon'
import { NgxDropzoneModule } from 'ngx-dropzone'
import { NgForOf, NgIf } from '@angular/common'
import { FirebaseStorageService } from '../../service/firebase-storage/firebase-storage'
import { CategoriesObjects } from '../../model/categories-objects/categories-objects.model'
import { lastValueFrom } from 'rxjs'
import {CambiazoStateService} from "../../states/cambiazo-state.service";

@Component({
  selector: 'app-create-info-post-content',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    NgxDropzoneModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './create-info-post-content.component.html',
  styleUrls: ['./create-info-post-content.component.css']
})
export class CreateInfoPostContentComponent implements OnInit {

  @Input() category_id: number | null = null
  @Input() product_name: string | null = null
  @Input() description: string | null = null
  @Input() change_for: string | null = null
  @Input() price: number | null = null
  @Input() images: string[] = []


  files: any[] = []
  imagesUrl: string[] = []
  maxFiles = 1
  totalFiles = 0

  formProduct = new FormGroup({
    category_id: new FormControl<number | null>(null, Validators.required),
    product_name: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
    change_for: new FormControl<string | null>(null, Validators.required),
    price: new FormControl<number | null>(null, Validators.required)
  })

  private cambiazoState: CambiazoStateService = inject(CambiazoStateService);
  categories: CategoriesObjects[] = []

  constructor(private storageService: FirebaseStorageService) {
    effect(() => {
      this.categories = this.cambiazoState.categoriesProducts();

    });

  }


  private mimeFromUrl(url: string): string {
    const ext = url.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png':  return 'image/png';
      case 'webp': return 'image/webp';
      case 'gif':  return 'image/gif';
      case 'bmp':  return 'image/bmp';
      default:     return 'image/*';
    }
  }

  async ngOnInit(): Promise<void> {
    this.formProduct.patchValue({
      category_id: this.category_id,
      product_name: this.product_name,
      description: this.description,
      change_for: this.change_for,
      price: this.price
    })
  }

  onSubmit(): any {
    this.formProduct.markAllAsTouched()
    return this.formProduct.valid ? this.formProduct.value : null
  }

  onSelect(event: any): void {
    if (!event.addedFiles.length) return
    const f: any = event.addedFiles[0]
    f.preview = URL.createObjectURL(f)
    this.files = [f]
    this.totalFiles = 1
  }

  onRemove(file: any): void {
    this.files = []
    this.totalFiles = 0
  }

  validateInput(event: InputEvent): void {
    if (event.data === '-' || event.data === '+') event.preventDefault()
  }

  async uploadImage(): Promise<string[]> {
    this.imagesUrl = []
    for (const file of this.files) {
      const { progress$, url$ } = this.storageService.uploadProductImage(file, this.category_id?.toString() || 'default')
      progress$.subscribe()
      const url = await lastValueFrom(url$)
      this.imagesUrl.push(url)
    }
    return this.imagesUrl
  }
}
