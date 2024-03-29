import { Dropdowns } from '@Components/Dropdown/Dropdown';
import { Schoolingo } from '@Schoolingo';
import { Component, Input } from '@angular/core';
import { Calendar } from './calendar';
import { Locale } from '@Schoolingo/Locale';
import { CalendarDay } from '@Schoolingo/Board.d';
import { Tabs } from '@Components/Tabs/Tabs';

export type CalendarOptions = {
  allowWeekends?: boolean;
  noWeekendError?: string;
}

@Component({
  selector: 'schoolingo-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  constructor(
    public schoolingo: Schoolingo,
    public dropdown: Dropdowns,
    public calendar: Calendar,
    public locale: Locale,
    public tabs: Tabs
    ) {}

  public declare customPickFunction: Function;

  @Input() name: string = '';
  @Input() options: CalendarOptions = {};
  @Input() date: Date = new Date();
  @Input() disabled!: boolean;

  ngOnInit(): void {
    this.calendar.addCalendar(this);
    this.dropdown.addDropdown('calendar_' + this.name);

    console.log(this.date);

    this.refreshCalendar();
  }

  ngOnDestroy(): void {
    this.calendar.removeCalendar(this);
  }


  // Utils
  public ceilNum(num: number): number {
    return Math.ceil(num);
  }

  public openCalendar(): void {
    if (this.disabled) return;
    this.dropdown.toggleDropdown('calendar_' + this.name)
  }


  // Calendar
  public getCalendarMonth(): Date {
    return this.date;
  }
  public calendarDays: CalendarDay[] = [];
  
  public resetCalendar(): void {
    this.date = this.schoolingo.getToday();
    this.refreshCalendar();
  }

  public refreshCalendar(): void {

    this.calendarDays = [];

    let firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    let lastMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    let daysBefore = (firstDay.getDay() === 1) ? 0 : (firstDay.getDay() === 0) ? 6 : firstDay.getDay() - 1;
    // Before
    for(let i = 0;i < daysBefore;i++) {
      this.calendarDays.push({
        day: (lastMonth.getDate() - (daysBefore - i) + 1),
        month: ((this.date.getMonth() == 0) ? 11 : this.date.getMonth() - 1),
        year:  ((this.date.getMonth() == 0) ? this.date.getFullYear() - 1 : this.date.getFullYear()),
        isMonth: false
      });
    }
    // This month
    let thisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
    for(let i = 1;i <= thisMonth.getDate();i++) {
      this.calendarDays.push({
        day: i,
        month: this.date.getMonth(),
        year:  this.date.getFullYear(),
        isMonth: true
      });
    }
    // After
    let daysAfter = (thisMonth.getDay() === 1) ? 6 : (thisMonth.getDay() === 0) ? 0 : this.schoolingo.days.length - thisMonth.getDay();
    for(let i = 1;i <= daysAfter;i++) {
      this.calendarDays.push({
        day: i,
        month: ((this.date.getMonth() == 11) ? 0 : this.date.getMonth() + 1),
        year:  ((this.date.getMonth() == 11) ? this.date.getFullYear() + 1 : this.date.getFullYear()),
        isMonth: false
      });
    }
  }

  public pickMonth(num: number): void {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + num);
    this.refreshCalendar();
  }

  public pickDate(date: Date): void {
    this.date = date;
    this.refreshCalendar();
    this.dropdown.closeAllDropdowns();
    if (this.customPickFunction) {
      this.customPickFunction(date);
    }
  }

  public returnAsDate(day: number, month: number, year: number): Date {
    return new Date(year, month, day);
  }


  
}
