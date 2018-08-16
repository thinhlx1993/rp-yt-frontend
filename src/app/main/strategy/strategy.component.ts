import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MatSnackBarConfig, PageEvent} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {StrategyService} from './strategy.service';
import 'rxjs-compat/add/operator/debounceTime';

@Component({
  selector: 'fury-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.scss']
})
export class StrategyComponent implements OnInit {
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
    private service: StrategyService,
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
    this.dialog.open(CreateEditStrategyComponent, {
      disableClose: false,
      data: {}
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  openEditDialog(row) {
    this.dialog.open(CreateEditStrategyComponent, {
      disableClose: false,
      data: row
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  openDeleteDialog(row) {
    this.dialog.open(DeleteStrategyComponent, {
      disableClose: false,
      data: row
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  refreshData(command) {
    if (command === 'refresh') {
      this.uploadPageIndex = 0;
      this.getData();
    }
  }
}

@Component({
  selector: 'fury-manage-strategy-dialog',
  template: `
    <div mat-dialog-title fxLayout="row" fxLayoutAlign="space-between center">
      <div>Quản lý chiến dịch</div>
      <button type="button" mat-icon-button (click)="close('do nothing')" tabindex="-1">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <form [formGroup]="form" (submit)="save()">
        <div class="login-content" fxLayout="column" fxLayoutAlign="start stretch">
          <mat-form-field>
            <input matInput type="text" placeholder="Tên chiến dịch" formControlName="name" required>
            <mat-hint>Ví dụ: Chiến dịch 1</mat-hint>
          </mat-form-field>
          <div fxLayout="row" fxLayoutGap="1em">
            <mat-form-field>
              <input matInput type="text" placeholder="Vấn đề gặp phải" formControlName="issue" required>
              <mat-hint>Ví dụ: Hate Speech Against a Protected Group</mat-hint>
            </mat-form-field>
            <mat-form-field>
              <input matInput type="text" placeholder="Chi tiết" formControlName="sub_issue" required>
              <mat-hint>Ví dụ: Sexual orientation/gender identity</mat-hint>
            </mat-form-field>
          </div>
          <mat-form-field>
            <textarea matInput rows="4" type="text" placeholder="Ghi chú" formControlName="note" required></textarea>
            <mat-hint>Cái này là ghi chú cho mục Additional note</mat-hint>
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


export class CreateEditStrategyComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateEditStrategyComponent>,
    private service: StrategyService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    if (this.data.hasOwnProperty('name')) {
      this.form = this.fb.group({
        _id: [this.data._id],
        name: [this.data.name, Validators.compose([Validators.required, Validators.maxLength(200)]) ],
        issue: [this.data.issue, Validators.compose([Validators.required, Validators.maxLength(200)]) ],
        sub_issue: [this.data.sub_issue, Validators.compose([Validators.maxLength(200), Validators.required])],
        note: [this.data.note, Validators.compose([Validators.required, Validators.maxLength(2000)])],
      });
    } else {
      this.form = this.fb.group({
        name: ['', Validators.compose([Validators.required, Validators.maxLength(200)]) ],
        issue: ['', Validators.compose([Validators.required, Validators.maxLength(200)]) ],
        sub_issue: ['', Validators.compose([Validators.maxLength(200), Validators.required])],
        note: ['', Validators.compose([Validators.required, Validators.maxLength(2000)])],
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
      <div>Xóa chiến dịch</div>
      <button type="button" mat-icon-button (click)="close('do nothing')" tabindex="-1">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <p>Bạn có muốn xóa chiến dịch: {{ data.name }}?</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Không</button>
      <button mat-raised-button color="warn" (click)="deleteFile()">Đồng ý xóa</button>
    </mat-dialog-actions>
  `
})
export class DeleteStrategyComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteStrategyComponent>,
    private service: StrategyService,
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
