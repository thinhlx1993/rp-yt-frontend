import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig, PageEvent} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserAgentService} from './useragent.service';
import 'rxjs-compat/add/operator/debounceTime';

@Component({
  selector: 'fury-useragent',
  templateUrl: './useragent.component.html',
  styleUrls: ['./useragent.component.scss']
})
export class UserAgentComponent implements OnInit {

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
    private service: UserAgentService,
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
    this.dialog.open(CreateEditUsersAgentComponent, {
      disableClose: false,
      data: {}
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  openEditDialog(row) {
    this.dialog.open(CreateEditUsersAgentComponent, {
      disableClose: false,
      data: row || {}
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  openDeleteDialog(row) {
    this.dialog.open(DeleteUserAgentComponent, {
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
  selector: 'fury-manage-useragent-dialog',
  template: `
    <div mat-dialog-title fxLayout="row" fxLayoutAlign="space-between center">
      <div>Quản lý user agent</div>
      <button type="button" mat-icon-button (click)="close('do nothing')" tabindex="-1">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <form [formGroup]="form" (submit)="save()">
        <div class="login-content" fxLayout="column" fxLayoutAlign="start stretch">
          <mat-form-field>
            <input matInput type="text" placeholder="Giá trị user agent" formControlName="name" required>
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

export class CreateEditUsersAgentComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateEditUsersAgentComponent>,
    private service: UserAgentService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    if (this.data.hasOwnProperty('_id')) {
      this.form = this.fb.group({
        _id: [this.data._id],
        name: [this.data.name, Validators.compose([Validators.required, Validators.maxLength(200)])],
      });
    } else {
      this.form = this.fb.group({
        name: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
      });
    }
  }

  close(results) {
    this.dialogRef.close(results);
  }

  save() {
    if (this.data.hasOwnProperty('_id')) {
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
  selector: 'fury-delete-useragent-dialog',
  template: `
    <div mat-dialog-title fxLayout="row" fxLayoutAlign="space-between center">
      <div>Xóa mục</div>
      <button type="button" mat-icon-button (click)="close('do nothing')" tabindex="-1">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <p>Xóa: {{ data.name }}?</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close('do nothing')">Không</button>
      <button mat-raised-button color="warn" (click)="deleteFile()">Đồng ý xóa</button>
    </mat-dialog-actions>
  `
})
export class DeleteUserAgentComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteUserAgentComponent>,
    private service: UserAgentService,
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
