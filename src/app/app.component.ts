import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {interval, Observable} from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  // signal to observable
  clickcount = signal(0);
  clickCount$ = toObservable(this.clickcount);
//observable to signal
interval$ = interval(1000);
intervalSignal = toSignal(this.interval$,{initialValue: 0});

/// custom observable

customInterval$= new Observable((subscriber)=>{
  let timesExecuted = 0;
  const intervall = setInterval(()=>{
    if(timesExecuted>3){
      clearInterval(intervall);
      subscriber.complete();
      return;
    }
    console.log("Emiting values...");
    subscriber.next({meassage: 'new value'});
    timesExecuted++;
  },2000);
});
  constructor(){
    // effect(()=>{
    //   console.log(`clicked button ${this.clickcount()} times.`);
    // });
   // toObservable(this.clickcount);   // or you could also call as a value for a property clickcount$ so $ means an observable property
  }
  private destroyRef =inject(DestroyRef);
  ngOnInit() : void{
  //  const subscription = interval(1000).subscribe({
  //     next: (val) => console.log(val),
  //         });
  // this.destroyRef.onDestroy(()=>{
  //       subscription.unsubscribe();
  //     });
const subscription = this.clickCount$.subscribe({
  next: (val)=> console.log(val),
});

  this.destroyRef.onDestroy(()=>{
    subscription.unsubscribe();
  });
// for custom observable
this.customInterval$.subscribe({
  next: (val)=> console.log(val),
  complete: ()=> console.log('Completed!')
})

  }
onclick(){
this.clickcount.update(prevCount => prevCount +1);
}
}

