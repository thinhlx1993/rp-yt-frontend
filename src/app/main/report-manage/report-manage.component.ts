import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig, PageEvent} from '@angular/material';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ReportService} from './report-manage.service';
import 'rxjs-compat/add/operator/debounceTime';
import {StrategyService} from '../strategy/strategy.service';
import {TimerObservable} from 'rxjs-compat/observable/TimerObservable';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'fury-report-manage',
  templateUrl: './report-manage.component.html',
  styleUrls: ['./report-manage.component.scss']
})
export class ReportManageComponent implements OnInit, OnDestroy {

  /**
   * Needed for uploader
   * @param {ManageService} manageService
   */
  alive: boolean;
  totals = 0;
  uploadPageIndex = 0;
  uploadPageSize = 10;
  rows = [];
  tableHover = false;
  tableStriped = true;
  tableCondensed = false;
  tableBordered = false;
  search: FormControl;
  /**
   * Needed for the Layout
   */
  private _gap = 16;
  gap = `${this._gap}px`;

  col(colAmount: number) {
    return `1 1 calc(${100 / colAmount}% - ${this._gap - (this._gap / colAmount)}px)`;
  }

  constructor(
    private snackBar: MatSnackBar,
    private service: ReportService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.search = new FormControl();
    this.getData();

    this.search.valueChanges.debounceTime(500).subscribe((searchText: string) => {
      this.uploadPageIndex = 0;
      this.getData();
    });

    // this.alive = true;
    // TimerObservable.create(0, 10000)
    //   .pipe(
    //     takeWhile(() => this.alive)
    //   )
    //   .subscribe(() => {
    //     this.getData();
    //   });
  }



  pageSizeChange(page?: PageEvent) {
    this.uploadPageIndex = page.pageIndex;
    this.uploadPageSize = page.pageSize;
    this.getData();
  }

  clearData() {
    if (this.search.value !== '') {
      this.search.setValue('');
      this.uploadPageIndex = 0;
      this.getData();
    }
  }

  getData() {
    this.service.get(this.uploadPageIndex, this.uploadPageSize, this.search.value).subscribe((res: any) => {{
      if (res.status) {
        this.rows = res.data.rows;
        this.totals = res.data.totals;
      }
    }});
  }

  createEmail() {
    this.dialog.open(CreateEditReportComponent, {
      disableClose: false,
      data: {}
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  openEditDialog(row) {
    this.dialog.open(CreateEditReportComponent, {
      disableClose: false,
      data: row || {}
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  openDeleteDialog(row) {
    this.dialog.open(DeleteChannelComponent, {
      disableClose: false,
      data: row
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  startReport(channel) {
    this.service.start(channel._id).subscribe((res: any) => {{
    }});
  }

  refreshData(command) {
    if (command === 'refresh') {
      this.uploadPageIndex = 0;
      this.getData();
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }
}


@Component({
  selector: 'fury-manage-email-dialog',
  template: `
    <div mat-dialog-title fxLayout="row" fxLayoutAlign="space-between center">
      <div>Quản lý kênh</div>
      <button type="button" mat-icon-button (click)="close('do nothing')" tabindex="-1">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <form [formGroup]="form" (submit)="save()">
        <div class="login-content" fxLayout="column" fxLayoutAlign="start stretch">
          <div fxLayout="row" fxLayoutGap="1em">
            <mat-form-field>
              <input matInput type="text" placeholder="Tên kênh" formControlName="name" required>
              <mat-hint>Ví dụ: Report Pro</mat-hint>
            </mat-form-field>
            <mat-form-field>
              <mat-select placeholder="Trạng thái" formControlName="status">
                <mat-option value="active">Active</mat-option>
                <mat-option value="Suspended">Suspended</mat-option>
                <mat-option value="inactive">Inactive</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field>
              <mat-select placeholder="Chiến dịch" formControlName="strategy">
                <mat-option [value]="item.id" *ngFor="let item of strategyData">{{item.name}}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <mat-form-field>
            <input matInput type="text" placeholder="Đường dẫn" formControlName="channel" required>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <!--<button mat-button (click)="close()">Cancel</button>-->
      <button mat-raised-button color="accent" (click)="save()" [disabled]="form.invalid">Lưu</button>
    </mat-dialog-actions>
  `
})


export class CreateEditReportComponent implements OnInit {
  form: FormGroup;
  strategyData: any;
  strategy: AbstractControl;
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateEditReportComponent>,
    private service: ReportService,
    private strategyService: StrategyService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.strategyService.getAll().subscribe((res: any) => {
      if (res.status) {
        this.strategyData = res.data;
      }
    });
    if (this.data.hasOwnProperty('name')) {
      this.form = this.fb.group({
        _id: [this.data.id],
        channel: [this.data.channel, Validators.compose([Validators.required, Validators.maxLength(200)])],
        name: [this.data.name, Validators.compose([Validators.required, Validators.maxLength(200)])],
        strategy: [this.data.strategy, Validators.compose([Validators.required])],
        status: [this.data.status, Validators.compose([Validators.required])],
      });
    } else {
      this.form = this.fb.group({
        channel: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
        name: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
        strategy: ['', Validators.compose([Validators.required])],
        status: ['active', Validators.compose([Validators.required])],
      });
    }

    this.strategy = this.form.controls['strategy'];
  }

  close(results) {
    this.dialogRef.close(results);
  }

  save() {
    if (this.data.hasOwnProperty('name')) {
      // edit
      this.service.edit(this.form.value).subscribe((res: any) => {
        this.showMessage(res);
      });
    } else {
      // create
      this.service.create(this.form.value).subscribe((res: any) => {
        this.showMessage(res);
      });
    }
  }

  showMessage(res: any) {
    if (res.status) {
      const snackBarConfig: MatSnackBarConfig = <MatSnackBarConfig>{
        duration: 10000,

        panelClass: ['snackbar-success']
      };
      this.snackBar.open(res.message, '', snackBarConfig);
      this.dialogRef.close('refresh');
    } else {
      const snackBarConfig: MatSnackBarConfig = <MatSnackBarConfig>{
        duration: 10000,
        panelClass: ['snackbar-error']
      };
      this.snackBar.open(res.message, '', snackBarConfig);
    }
  }
}

@Component({
  selector: 'fury-delete-strategy-dialog',
  template: `
    <div mat-dialog-title fxLayout="row" fxLayoutAlign="space-between center">
      <div>Xóa kênh</div>
      <button type="button" mat-icon-button (click)="close('do nothing')" tabindex="-1">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <p>Bạn có muốn xóa kênh: {{ data.name }}?</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close('do nothing')">Không</button>
      <button mat-raised-button color="warn" (click)="deleteFile()">Đồng ý xóa</button>
    </mat-dialog-actions>
  `
})
export class DeleteChannelComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteChannelComponent>,
    private service: ReportService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  close(results) {
    this.dialogRef.close(results);
  }

  deleteFile() {
    this.service.remove(this.data._id).subscribe((res: any) => {
      if (res.status) {
        const snackBarConfig: MatSnackBarConfig = <MatSnackBarConfig>{
          duration: 10000,
          panelClass: ['snackbar-success']
        };
        this.snackBar.open(res.message, '', snackBarConfig);
        this.dialogRef.close('refresh');
      }
    });
  }
}

