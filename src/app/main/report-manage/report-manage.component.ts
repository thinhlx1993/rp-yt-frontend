import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig, PageEvent} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ReportService} from './report-manage.service';
import 'rxjs-compat/add/operator/debounceTime';

@Component({
  selector: 'fury-report-manage',
  templateUrl: './report-manage.component.html',
  styleUrls: ['./report-manage.component.scss']
})
export class ReportManageComponent implements OnInit {

  /**
   * Needed for uploader
   * @param {ManageService} manageService
   */
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
          <mat-form-field>
            <input matInput type="text" placeholder="Tên kênh" formControlName="name" required>
            <mat-hint>Ví dụ: Report Pro</mat-hint>
          </mat-form-field>
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
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateEditReportComponent>,
    private service: ReportService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    if (this.data.hasOwnProperty('name')) {
      this.form = this.fb.group({
        _id: [this.data._id],
        channel: [this.data.channel, Validators.compose([Validators.required, Validators.maxLength(200)])],
        name: [this.data.name, Validators.compose([Validators.required, Validators.maxLength(200)])],
      });
    } else {
      this.form = this.fb.group({
        channel: [this.data.channel, Validators.compose([Validators.required, Validators.maxLength(200)])],
        name: [this.data.name, Validators.compose([Validators.required, Validators.maxLength(200)])],
      });
    }
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
      <button mat-button (click)="close()">Không</button>
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

