import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductWrapperComponent } from './edit-product-wrapper.component';

describe('EditProductWrapperComponent', () => {
  let component: EditProductWrapperComponent;
  let fixture: ComponentFixture<EditProductWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProductWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
