import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig, PageEvent} from '@angular/material';
import {ViewsManageService} from './views-manage.service';
import 'rxjs-compat/add/operator/debounceTime';

@Component({
  selector: 'fury-views-manage',
  templateUrl: './views-manage.component.html',
  styleUrls: ['./views-manage.component.scss']
})
export class ViewsManageComponent implements OnInit {
  alive: boolean;
  totals = 0;
  pageIndex = 0;
  pageSize = 10;
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
    private service: ViewsManageService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.search = new FormControl();
    this.getData();

    this.search.valueChanges.debounceTime(500).subscribe((searchText: string) => {
      this.pageIndex = 0;
      this.getData();
    });
  }

  pageSizeChange(page?: PageEvent) {
    this.pageIndex = page.pageIndex;
    this.pageSize = page.pageSize;
    this.getData();
  }

  clearData() {
    if (this.search.value !== '') {
      this.search.setValue('');
      this.pageIndex = 0;
      this.getData();
    }
  }

  getData() {
    this.service.get(this.pageIndex, this.pageSize, this.search.value).subscribe((res: any) => {{
      if (res.status) {
        this.rows = res.data.rows;
        this.totals = res.data.totals;
      }
    }});
  }

  create() {
    this.dialog.open(CreateEditViewsComponent, {
      disableClose: false,
      data: {}
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  openEditDialog(row) {
    this.dialog.open(CreateEditViewsComponent, {
      disableClose: false,
      data: row || {}
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  openDeleteDialog(row) {
    this.dialog.open(DeleteViewsComponent, {
      disableClose: false,
      data: row
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  refreshData(command) {
    if (command === 'refresh') {
      this.pageIndex = 0;
      this.getData();
    }
  }

}


@Component({
  selector: 'fury-manage-views-dialog',
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
              <input matInput type="text" placeholder="Từ khóa" formControlName="keyword" required>
            </mat-form-field>
            <mat-form-field>
              <mat-select placeholder="Trạng thái" formControlName="status">
                <mat-option value="active">Hoạt động</mat-option>
                <mat-option value="inactive">Tạm dừng</mat-option>
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


export class CreateEditViewsComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateEditViewsComponent>,
    private service: ViewsManageService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    if (this.data.hasOwnProperty('keyword')) {
      this.form = this.fb.group({
        _id: [this.data._id],
        keyword: [this.data.keyword, Validators.compose([Validators.required, Validators.maxLength(200)])],
        channel: [this.data.channel, Validators.compose([Validators.required, Validators.maxLength(200)])],
        status: [this.data.status, Validators.compose([Validators.required])],
      });
    } else {
      this.form = this.fb.group({
        channel: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
        keyword: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
        status: ['active', Validators.compose([Validators.required])],
      });
    }
  }

  close(results) {
    this.dialogRef.close(results);
  }

  save() {
    if (this.data.hasOwnProperty('keyword')) {
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
  selector: 'fury-delete-views-dialog',
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
export class DeleteViewsComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteViewsComponent>,
    private service: ViewsManageService,
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
