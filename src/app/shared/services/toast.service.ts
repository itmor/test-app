import { Injectable, ViewContainerRef, ComponentFactoryResolver, inject } from '@angular/core';

import { ToastComponent, ToastPosition, ToastStyle } from '@shared/components/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private viewContainerRef: ViewContainerRef;
  private componentFactoryResolver = inject(ComponentFactoryResolver);

  setViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  show(message: string, position: ToastPosition, style: ToastStyle) {
    const toastFactory = this.componentFactoryResolver.resolveComponentFactory(ToastComponent);
    const toastRef = this.viewContainerRef.createComponent(toastFactory);

    toastRef.instance.message = message;
    toastRef.instance.position = position;
    toastRef.instance.style = style;

    setTimeout(() => {
      toastRef.destroy();
    }, 5000);
  }
}
