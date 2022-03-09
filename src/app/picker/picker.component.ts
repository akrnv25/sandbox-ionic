import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickerComponent<T> implements OnInit, OnDestroy {

  @Input() items: T[];
  @Input() set selected(item: T) {
    setTimeout(() => {
      const itemIdx = this.getItemIdx(item);
      this.scrollToItem(itemIdx);
    }, 100);
  }

  @Output() selectedChange: EventEmitter<T> = new EventEmitter();

  @ViewChild('scrollContainer', { static: true }) private scrollContainerRef: ElementRef;
  private destroy$: Subject<void> = new Subject();

  ngOnInit(): void {
    fromEvent(this.scrollContainerRef.nativeElement, 'scroll')
      .pipe(
        debounceTime(100),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        // @ts-ignore
        const { scrollTop } = event.target;
        const selectedItemIdx = Math.round(scrollTop / 60);
        const needTwist = scrollTop % 60;
        if (needTwist) {
          this.scrollToItem(selectedItemIdx);
        } else {
          this.selectedChange.emit(this.items[selectedItemIdx]);
        }
      });
  }

  scrollToItem(itemIdx: number): void {
    const top = itemIdx > 0 ? itemIdx * 60 : 0;
    this.scrollContainerRef.nativeElement.scrollTo({ top, behavior: 'smooth' });
  }

  getItemIdx(item: T): number {
    const itemIdx = this.items.findIndex(i => i === item);
    return itemIdx !== -1 ? itemIdx : 0;
  }

  switchItem(direction: 'prev' | 'next'): void {
    const { scrollTop } = this.scrollContainerRef.nativeElement;
    const currentItemIdx = Math.round(scrollTop / 60);
    switch (direction) {
      case 'prev':
        const prevItemIdx = currentItemIdx - 1;
        const firstItemIdx = 0;
        if (prevItemIdx >= firstItemIdx) {
          this.scrollToItem(prevItemIdx);
        }
        break;
      case 'next':
        const nextItemIdx = currentItemIdx + 1;
        const lastItemIdx = this.items.length - 1;
        if (nextItemIdx <= lastItemIdx) {
          this.scrollToItem(nextItemIdx);
        }
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
