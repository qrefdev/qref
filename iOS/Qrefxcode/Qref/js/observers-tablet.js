//602 - Removed Sync from all editing, and instead just lets sync auto sync and let the user sync.

var HelpObserver = new zimoko.Observable({
  backTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();

    Navigation.back();
  },
  menuTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();

    MenuObserver.toggle();
  }
});

var MarketingObserver = new zimoko.Observable({
  signupTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    Navigation.go('#register');
  },
  sampleTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();

    //Load Sample Data
    //Then goto checklist
    $.ajax({
      type: "get",
      dataType: "json",
      url: host + "services/ajax/aircraft/checklist-sample?timestamp=" + Date.now(),
      success: function(data) {
        var response = data;

        if (response.success == true) {
          if (response.records.length > 0) {
            var checklist = new zimoko.Observable(response.records[0]);

            ChecklistObserver.set('checklist', checklist);
            Navigation.go('#checklist');
          } else {
            var dialog = new Dialog('#infobox', 'Failed to get sample checklist!');
            dialog.show();
          }
        } else {
          var dialog = new Dialog('#infobox', 'Failed to get sample checklist!');
          dialog.show();
        }
      },
      error: function() {
        var dialog = new Dialog('#infobox', 'Internet connection required to view sample checklist.');
        dialog.show();
      }
    });
  },
  signinTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    Navigation.go('#signin');
  }
});

var EditAddObserver = new zimoko.Observable({
  item: new zimoko.Observable({
    check: '',
    response: '',
    index: 0,
    icon: null,
    isChecked: false,
    _id: new ObjectId().toString()
  }),
  adding: false,
  index: 0,
  menuTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    MenuObserver.toggle();
  },
  backTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();

    $('#editAddForm input').blur();

    EditAddObserver.set('item', new zimoko.Observable({
      check: '',
      response: '',
      index: 0,
      isChecked: false,
      icon: null,
      _id: new ObjectId().toString()
    }));

    ChecklistObserver.render();

    Navigation.back();
  },
  edit: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    $('#editAddForm input').blur();

    if (EditAddObserver.adding) {
      EditAddObserver.set('adding', false);
      var index = EditAddObserver.index;
      var list = ChecklistObserver.list;
      var section = ChecklistObserver.section;
      var category = ChecklistObserver.category;

      var sectionItems = []

      //Emergency Category Changes
      if (list != 'emergencies') {
        sectionItems = ChecklistObserver.checklist[list][section].items;
      }
      else {
        sectionItems = ChecklistObserver.checklist[list][category].items[section].items;
      }

      if (index > sectionItems.length) {
        index = sectionItems.length - 1;
      }

      EditAddObserver.item.set('index', index + 1);



      for (var i = 0; i < sectionItems.length; i++) {
        var itm = sectionItems[i];

        if(itm.index >= index + 1) {
          itm.index++;
        }
      }

      sectionItems.push(EditAddObserver.item._original);

      ChecklistObserver.itemsDataSource.data(sectionItems);
    }

    ChecklistObserver.set('modified', true);

    if (!_.isEqual(EditAddObserver.item._unmodified, EditAddObserver.item._original)) {
      var versionInfo = AppObserver.getChecklistVersionObject(ChecklistObserver.checklist._id);

      if (versionInfo) {
        versionInfo.lastCheckpointSerialNumber = (new Date()).getTime();
        setTimeout(function() {
          Sync.syncVersionInfoToPhone([versionInfo]);
        }, 500);
      }
    }

    EditAddObserver.set('item', new zimoko.Observable({
      check: '',
      response: '',
      index: 0,
      isChecked: false,
      icon: null,
      _id: new ObjectId().toString()
    }));

    ChecklistObserver.render();

    setTimeout(function() {
      Navigation.back();
    }, 100);
  }
});

var EditTailObserver = new zimoko.Observable({
  item: undefined,
  menuTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    MenuObserver.toggle();
  },
  backTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();

    $('#editTailForm input').blur();

    setTimeout(function() {
      Navigation.back();
    }, 100);
  },
  editTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();

    $('#editTailForm input').blur();

    if (EditTailObserver.item) {
      setTimeout(function() {
        Sync.syncOneLocal(EditTailObserver.item._original);
      }, 100);

      if (!_.isEqual(EditTailObserver.item._unmodified, EditTailObserver.item._original)) {
        var versionInfo = AppObserver.getChecklistVersionObject(EditTailObserver.item._id);

        if (versionInfo) {
          versionInfo.lastCheckpointSerialNumber = (new Date()).getTime();
          setTimeout(function() {
            Sync.syncVersionInfoToPhone([versionInfo]);
          }, 500);
        }
      }
    }
    setTimeout(function() {
      Navigation.back();
    }, 100);
  }
});

var EmergenciesDataSource = new zimoko.DataSource({
  pageSize: 1000
});

var EmergenciesObserver = new zimoko.Observable({
  emergencies: [],
  itemTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();

    zimoko.Async.each([
        function() {
          ChecklistObserver.set('category', data.index);
        },
        function() {
          ChecklistObserver.set('list', 'emergencies');
        },
        function() {
          ChecklistObserver.set('showSections', false);
        },
        function() {
          EmergenciesSectionsObserver.set('sectionName', data.name);
          EmergenciesSectionsObserver.set('sections', data.items.toObservableObjects());
        },
        function() {
          setTimeout(function() {
            Navigation.go('emergencies-sections');
          }, 100);
        }
      ],
      function(index, item) {
        item();
      });

  },
  menuTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    MenuObserver.toggle();
  },
  backTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();

    if (AppObserver.token) {
      Navigation.go("dashboard");
    } else {
      Navigation.go('#marketing');
    }
  }
});

var EmergenciesSectionsObserver = new zimoko.Observable({
  sections: [],
  sectionName: '',
  backTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    Navigation.back();
  },
  sectionTap: function(element, e, data) {
    ChecklistObserver.set('section', data.index);

    setTimeout(function() {
      Navigation.go('checklist');
    }, 100);
  },
  menuTap: function(element, e, data) {
    MenuObserver.toggle();
  }
});

var E6BObserver = new zimoko.Observable({
  topConversionValue: '0',
  bottomConversionValue: '0',
  topType: 'MPH',
  bottomType: 'KTS',
  conversionMultiplier: 0.868976242,
  conversionInverse: 1.150779448,
  conversionSelectedName: 'MPH <i class="icon icon-resize-horizontal"></i> KTS',
  conversionSelected: $('#conversion-items li[class="active"]'),
  showConversions: false,
  backTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    Navigation.back();
  },
  menuTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    MenuObserver.toggle();
  },
  conversionsTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    E6BObserver.set('showConversions', !E6BObserver.showConversions);
  },
  conversionTap: function(element, e, data) {
    var ele = $(element);

    e.stopPropagation();
    e.preventDefault();

    ele.parent().find('li').removeClass('active');
    ele.addClass('active');

    E6BObserver.set('conversionSelected', ele);
    E6BObserver.set('showConversions', false);
  },
  conversionTopKeyUp: function(element, e, data) {
    E6BObserver.topConversionValue = $(element).val();
    E6BObserver.convertTopToBottom();
  },
  conversionBottomKeyUp: function(element, e, data) {
    E6BObserver.bottomConversionValue = $(element).val();
    E6BObserver.convertBottomToTop();

  },
  conversionTopKeyDown: function(element, e, data) {
    if ($(element).val().length >= 8 && e.which != 8 && e.which != 46) {
      e.stopPropagation();
      e.preventDefault();
    }
  },
  conversionBottomKeyDown: function(element, e, data) {
    if ($(element).val().length >= 8 && e.which != 8 && e.which != 46) {
      e.stopPropagation();
      e.preventDefault();
    }
  },
  onPropertyChanged: function(sender, property) {
    if (property == 'conversionSelected') {
      if (this.conversionSelected != undefined) {

        SelectedName = this.conversionSelected.attr('data-top') + ' <i class="icon icon-resize-horizontal"></i> ' + this.conversionSelected.attr('data-bottom');
        this.conversionMultiplier = parseFloat(this.conversionSelected.attr('data-multiplier'));
        this.conversionInverse = parseFloat(this.conversionSelected.attr('data-inverse'));
        this.set('topType', this.conversionSelected.attr('data-top'));
        this.set('bottomType', this.conversionSelected.attr('data-bottom'));
        this.set('conversionSelectedName', SelectedName);

        this.convertTopToBottom();
      }
    }
  },
  convertTopToBottom: function() {
    if (parseInt(this.conversionSelected.attr('data-value')) != 6) {
      if (zimoko.isNumber(this.topConversionValue)) {
        var topValue = parseFloat(this.topConversionValue);

        var finalVal = topValue * this.conversionMultiplier;
        this.set('bottomConversionValue', finalVal.toFixed(2));
      }
    }
  },
  convertBottomToTop: function() {
    if (parseInt(this.conversionSelected.attr('data-value')) != 6) {
      if (zimoko.isNumber(this.bottomConversionValue)) {
        var bottomValue = parseFloat(this.bottomConversionValue);

        var finalVal = bottomValue * this.conversionInverse;
        this.set('topConversionValue', finalVal.toFixed(2));
      }
    }
  },
});

E6BObserver.subscribe('conversionSelected', E6BObserver);

var StoreDataSource = new zimoko.DataSource({
  pageSize: 20
});

var StoreObserver = new zimoko.Observable({
  dataSource: StoreDataSource,
  items: StoreDataSource.view(),
  displayRequestModel: false,
  menuTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    MenuObserver.toggle();
  },
  backTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    Navigation.back();
  },
  requestModelTap: function(element, e, data) {
    window.location = 'mailto:admin@qref.com?subject=Model+Request';
  },
  itemTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    ProductDetailsObserver.set('product', data);
    Navigation.go('#productdetails');

    if (data.userOwnsProduct) {
      $(element).removeClass('active');
      $(element).addClass('active');
    }
  },
  sampleTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();

    //Load Sample Data
    //Then goto checklist
    $.ajax({
      type: "get",
      dataType: "json",
      url: host + "services/ajax/aircraft/checklist-sample?timestamp=" + Date.now(),
      success: function(data) {
        var response = data;

        if (response.success == true) {
          if (response.records.length > 0) {
            var checklist = new zimoko.Observable(response.records[0]);

            ChecklistObserver.set('checklist', checklist);
            Navigation.go('#checklist');
          } else {
            var dialog = new Dialog('#infobox', 'Failed to get sample checklist!');
            dialog.show();
          }
        } else {
          var dialog = new Dialog('#infobox', 'Failed to get sample checklist!');
          dialog.show();
        }
      },
      error: function() {
        var dialog = new Dialog('#infobox', 'Internet connection required to view sample checklist.');
        dialog.show();
      }
    });
  },
  onDataSourceRead: function(event) {
    var imageProcessor = new ImageProcessor(StoreObserver.items.toArray(), "productListing", true);
    imageProcessor.init();
    imageProcessor.processImages();
  }
});

StoreObserver.dataSource.subscribe(StoreObserver);

var ProductDetailsObserver = new zimoko.Observable({
  product: undefined,
  menuTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    MenuObserver.toggle();
  },
  backTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    Navigation.back();
  },
  purchaseTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    AppObserver.set('loading', true);

    if (ProductDetailsObserver.product) {
      if (ProductDetailsObserver.product.userOwnsProduct) {
        //var prod = ProductDetailsObserver.product;
        //var foundChecklist = _.find(checklists, function(item) {
        //	if(item.manufacturer._id == prod.manufacturer._id
        //		&& item.model._id == prod.model._id && item.isDeleted == false) {
        //		return true;
        //	}
        //
        //	return false;
        //});

        //if(foundChecklist) {
        Install(ProductDetailsObserver.product._id);
        //}
        //else {
        //	window.location.href = "qref://purchase=" + ProductDetailsObserver.product.appleProductIdentifier;
        //}
      } else {
        CallObjectiveC("qref://purchase=" + ProductDetailsObserver.product.appleProductIdentifier);
      }
    } else {
      AppObserver.set('loading', false);
    }
  },
  getPricingDetails: function() {
    if (this.product.userOwnsProduct) {
      //var prod = this.product;
      //var foundChecklist = _.find(checklists, function(item) {
      //	if(item.manufacturer._id == prod.manufacturer._id
      //		&& item.model._id == prod.model._id && item.isDeleted == false) {
      //		return true;
      //	}

      //	return false;
      //});

      //if(foundChecklist) {
      return 'Install';
      //}
      //else {
      //	return 'Restore';
      //}
    } else {
      return '$' + this.product.suggestedRetailPrice.toFixed(2);
    }
  },
  onPropertyChanged: function(sender, property) {
    if (property == 'product') {
      var imageProcessor = new ImageProcessor([this.product._original], "productDetails", false);
      imageProcessor.init();
      imageProcessor.processImages();
    }
  }
});

ProductDetailsObserver.subscribe('product', ProductDetailsObserver);

//601 - Sped up menu animation
//602 - Fixed close issue on some menu item taps
var MenuObserver = new zimoko.Observable({
  email: '',
  token: undefined,
  version: '0.1.2',
  menuNavTap: function(element, e, data) {
    var ele = $(element);

    e.stopPropagation();
    e.preventDefault();

    if (AppObserver.navHash != '#' + ele.attr('data-link')) {
      if (ele.attr('data-link') == 'dashboard') {
        if (AppObserver.token && checklists.length > 0) {
          Navigation.go('#' + ele.attr('data-link'));
        } else {
          Navigation.go('#marketing');
        }
      } else {
        Navigation.go('#' + ele.attr('data-link'));
      }
    }

    MenuObserver.close();
  },
  orderPrintedTap: function(element, e, data) {
    window.location = 'http://www.qref.com';
    this.close();
  },
  helpTap: function(element, e, data) {
    e.stopPropagation();
    Navigation.go('#help');
    this.close();
  },
  restoreAllTap: function(element, e, data) {
    e.stopPropagation();
    AppObserver.set('loading', true);

    var dialog = new ConfirmationDialog("#restoreAll", function(result) {
      if (result) {
        CallObjectiveC("qref://restoreAll=yes");
      } else {
        AppObserver.set('loading', false);
      }
    });

    dialog.show();
  },
  downloadTap: function(element, e, data) {
    if (AppObserver.navHash != '#downloads') {
      AppObserver.set('loading', true);
      StoreObserver.set('displayRequestModel', false);
      if (reachability) {
        AppObserver.getAllProducts(function(success, items) {
          AppObserver.set('storeHasItems', success);

          if (success) {
            AppObserver.set('loading', false);
            Navigation.go('#downloads');
          } else {
            AppObserver.set('loading', false);
            if (AppObserver.token) {
              var dialog = new Dialog('#infobox', 'Cannot connect to the Qref Store, or there are no items currently available');
              dialog.show();
            } else {
              var dialog = new Dialog('#infobox', 'You must be signed in to access the store');
              dialog.show();
            }
          }
        });
      } else {
        var dialog = new Dialog('#infobox', 'An internet connection is required to access the store');
        dialog.show();
      }
    }

    MenuObserver.close();
  },
  checkingTap: function(element, e, data) {
    var checkbox = $(element).find('input').get(0);

    e.stopPropagation();
    e.preventDefault();

    if (ChecklistObserver.canCheck) {
      checkbox.checked = false;
      ChecklistObserver.set('canCheck', false);
      CallObjectiveC('qref://setCanCheck=false');
    } else {
      checkbox.checked = true;
      ChecklistObserver.set('canCheck', true);
      CallObjectiveC('qref://setCanCheck=true');
    }
  },
  signOutNavTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();

    var dialog = new ConfirmationDialog("#signoutbox", function(result) {
      if (result) {
        AppObserver.set('token', undefined);
        AppObserver.set('email', '');
        CallObjectiveC("qref://clearToken&clearUser");
        AppObserver.cachePack = undefined;
        checklists = undefined;
        DashboardDataSource.clear();
        ChecklistObserver.set('checklist', undefined);
        DashboardObserver.set('dataSource', undefined);

        if (AppObserver.navHash != '#dashboard') {
          Navigation.go('#dashboard');
        }
      }
    });

    dialog.show();

    MenuObserver.close();
  },
  syncNavTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    Sync.sync();
    MenuObserver.close();
  },
  open: function() {
    if (!$('.menu').hasClass('slided')) {
      $('.menu').show();
      $('.front .dashcontent').animate({
        left: '-245px'
      }, 100);
      $('.page,.page-hidden-tap').animate({
        left: '-245px'
      }, 100);
      $('.checklistnav').animate({
        left: '-245px'
      }, 100);
      $('.menu').animate({
        right: '-5px'
      }, 100).addClass('slided');
      AppObserver.set('menuOpen', true);
      DashboardObserver.set('editing', false);
      ChecklistObserver.set('editing', false);
    }
  },
  close: function() {
    if ($('.menu').hasClass('slided')) {
      $('.page,.page-hidden-tap').animate({
        left: '0px'
      }, 100);
      $('.front .dashcontent').animate({
        left: '0px'
      }, 100);
      $('.checklistnav').animate({
        left: '0px'
      }, 100);
      $('.menu').animate({
        right: '-300px'
      }, 100, function(e) {
        $('.menu').hide();
      }).removeClass('slided');
      AppObserver.set('menuOpen', false);
    }
  },
  toggle: function() {
    if (!$('.menu').hasClass('slided')) {
      this.open();
    } else {
      this.close();
    }
  }
});

var AppObserver = new zimoko.Observable({
  email: '',
  cachePack: undefined,
  token: undefined,
  loading: false,
  syncing: false,
  saving: false,
  reachable: true,
  navHash: '#dashboard',
  allProducts: [],
  userProducts: [],
  isSorting: false,
  menuOpen: false,
  checklistVersions: [],
  /* lastCheckpointSerialNumber: null, */
  deviceName: null,
  pageTap: function(element, e, data) {
    MenuObserver.close();
  },
  checklistNavTap: function(element, e, data) {
    var ele = $(element);

    if (ChecklistObserver.editing && ChecklistObserver.modified) {
      if (ChecklistObserver.checklist._original._id != '5252fe02b2325732290016ed') {
        Sync.syncOneLocal(ChecklistObserver.checklist._original);
        ChecklistObserver.set('modified', false);
      }
    }

    $('.scrollable').stop();

    $('#checklist .checklist').scrollTop(0);

    zimoko.Async.each([
      (function() {
        ChecklistObserver.set('editing', false);
      }), (function() {
        ChecklistObserver.set('showSections', false);
      }), (function() {
        setTimeout(function() {
          setTimeout(function() {
            if (ele.attr('data-link') == 'emergencies') {
              if ($('#emergencies').css('display') == 'none') {
                Navigation.go('#emergencies');
              }
            } else {
              if ($('#checklist').css('display') == 'none') {
                Navigation.go("#checklist");
              }
            }
          }, 10);

          if (ChecklistObserver.list == ele.attr('data-link'))
            ele.addClass('active');

          setTimeout(function() {
            ChecklistObserver.set('list', ele.attr('data-link'));
          }, 10);
        }, 10);
      })
    ], function(index, item) {
      item();
    });

    e.stopPropagation();
    e.preventDefault();
  },
  keyUp: function(element, e, data) {
    if (e.which == 13) {
      $(element).closest('form').submit();
      $('input').blur();
    }
  },
  menuTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    MenuObserver.toggle();
  },
  backTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    Navigation.back();
  },
  navTap: function(element, e, data) {
    var ele = $(element);

    e.stopPropagation();
    e.preventDefault();

    Navigation.go('#' + ele.attr('data-link'));
  },
  passwordAuthCodeTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();

    Navigation.go('#passwordAuthCode');
  },
  onPropertyChanged: function(sender, property) {
    if (property == 'token') {
      MenuObserver.set('token', this.token);
      DashboardObserver.set('token', this.token);
    } else if (property == 'reachable') {
      if (AppObserver.reachable == false) {
        $('.menu li[data-link="changePassword"]').hide();
        $('.help').hide();
      } else {
        $('.menu li[data-link="changePassword"]').show();
        $('.help').show();
      }
    } else if (property == 'email') {
      MenuObserver.set('email', this.email);
    } else if (property == 'allProducts') {
      var _this = this;
      StoreObserver.dataSource.preventRead = true;
      StoreObserver.dataSource.clear();
      StoreObserver.dataSource.sort(new zimoko.Sort(['manufacturer.name', 'model.name'], 'asc'));
      StoreObserver.dataSource.filter(new zimoko.FilterSet('and', [
        new zimoko.Filter('==', 'isPublished', true),
        new zimoko.Filter('==', 'isDeleted', false)
      ]));

      setTimeout(function() {
        StoreObserver.dataSource.data(_this.allProducts);
        setTimeout(function() {
          StoreObserver.onDataSourceRead();
        }, 100);
      }, 100);
    } else if (property == 'navHash') {
      if (this.navHash == '#checklist') {
        $('#checklist-nav li').removeClass('active');
        $('#checklist-nav li[data-link="' + ChecklistObserver.list + '"]').addClass('active');
      }
    }
  },
  //BKing API Addition
  userChecklists: function(callback) {
    var self = this;

    var metalist = [];

    for (var i = 0; i < checklists.length; i++) {
      var meta = {};

      var checklist = checklists[i];

      meta.model = checklist.model.name;
      meta.manufacturer = checklist.manufacturer.name;
      meta.id = checklist._id;

      var iconUrl = '';

      if (checklist.productIcon) {
        var iconSplit = checklist.productIcon.split('/');

        for (var j = 0; j < iconSplit.length; j++) {
          if (j == iconSplit.length - 1) {
            iconUrl += '/checklistlisting' + iconSplit[j];
          } else {
            iconUrl += '/' + iconSplit[j];
          }
        }
      }

      meta.icon = iconUrl;

      metalist.push(meta);
    }

    CallObjectiveC('qref://' + callback + '=' + btoa(encodeURIComponent(JSON.stringify(metalist))));
  },
  //BKing API Addition
  purchasableProducts: function(callback) {
    var self = this;

    var metalist = [];

    if (reachability) {
      self.getAllProducts(function(success, items) {
        for (var i = 0; i < items.length; i++) {
          var meta = {};
          var product = items[i];

          meta.model = product.model.name;
          meta.manufacturer = product.manufacturer.name;
          meta.appleProductId = product.appleProductIdentifier;

          var iconUrl = '';

          if (product.productIcon) {
            var iconSplit = product.productIcon.split('/');

            for (var j = 0; j < iconSplit.length; j++) {
              if (j == iconSplit.length - 1) {
                iconUrl += '/checklistlisting' + iconSplit[j];
              } else {
                iconUrl += '/' + iconSplit[j];
              }
            }
          }

          var coverUrl = '';

          if (product.coverImage) {
            var iconSplit = product.productIcon.split('/');

            for (var j = 0; j < iconSplit.length; j++) {
              if (j == iconSplit.length - 1) {
                coverUrl += '/productDetails' + iconSplit[j];
              } else {
                coverUrl += '/' + iconSplit[j];
              }
            }
          }


          meta.icon = iconUrl;
          meta.cover = coverUrl;

          metalist.push(meta);
        }

       CallObjectiveC('qref://' + callback + '=' + btoa(encodeURIComponent(JSON.stringify(metalist))));
      });
    } else {
      CallObjectiveC('qref://' + callback + '=' + btoa(encodeURIComponent(JSON.stringify(metalist))));
    }
  },
  //BKing API Addition
  openChecklist: function(id, section) {
    setTimeout(function() {
      var checklist = undefined;
      var items = DashboardObserver.items;

      for (var i = 0; i < items.length; i++) {
        if (id == items.elementAt(i)._id) {
          checklist = items.elementAt(i);
          break;
        }
      }

      if (checklist) {
        CallObjectiveC('qref://checklistopen=' + btoa(encodeURIComponent('starting')));
        setTimeout(function() {
          ChecklistObserver.set('checklist', checklist);

          if (section && (section == 'preflight' || section == 'emergencies' || section == 'takeoff' || section == 'landing')) {
            setTimeout(function() {
              ChecklistObserver.set('list', section);

              CallObjectiveC('qref://checklistopen=' + btoa(encodeURIComponent('yes')));
              Navigation.go('#checklist');
            }, 250);
          }
        }, 250);

        return;
      }

      CallObjectiveC('qref://checklistopen=' + btoa(encodeURIComponent('no')));
    }, 1000);
  },
  //BKing API Addition
  resetChecks: function(id) {
    setTimeout(function() {
      var checklist = undefined;
      var items = DashboardObserver.items;

      for (var i = 0; i < items.length; i++) {
        if (id == items.elementAt(i)._id) {
          checklist = items.elementAt(i);
          break;
        }
      }

      if (checklist) {
        CallObjectiveC('qref://resetchecks=' + btoa(encodeURIComponent('yes')));
        var preflight = checklist.preflight;
        var takeoff = checklist.takeoff;
        var landing = checklist.landing;
        var emergencies = checklist.emergencies;

        if (checklist == ChecklistObserver.checklist) {
          setTimeout(function() {
            for (var i = 0; i < ChecklistObserver.items.length; i++) {
              ChecklistObserver.items.elementAt(i).set('isChecked', false);
            }
          }, 100);
        }

        setTimeout(function() {
          for (var i = 0; i < preflight.length; i++) {
            var section = preflight[i];
            var itms = section.items;

            for (var j = 0; j < items.length; j++) {
              itms[j].isChecked = false;
            }
          }

          for (var i = 0; i < takeoff.length; i++) {
            var section = takeoff[i];
            var itms = section.items;

            for (var j = 0; j < items.length; j++) {
              itms[j].isChecked = false;
            }
          }

          for (var i = 0; i < landing.length; i++) {
            var section = landing[i];
            var itms = section.items;

            for (var j = 0; j < items.length; j++) {
              itms[j].isChecked = false;
            }
          }

          for (var i = 0; i < emergencies.length; i++) {
            var category = emergencies[i].items;

            for (var j = 0; j < category.length; j++) {
              var section = category[j].items;

              for (s = 0; s < section.length; s++) {
                section[s].isChecked = false;
              }
            }
          }

        }, 250);

        return;
      }

      CallObjectiveC('qref://resetchecks=' + btoa(encodeURIComponent('no')));
    }, 1000);
  },
  getChecklist: function(id) {
    for (var i = 0; i < checklists.length; i++) {
      if (checklists[i]._id == id)
        return btoa(escape(encodeURIComponent(JSON.stringify(checklists[i]))));
    }

    return '';
  },
  getChecklistVersionInfo: function(id) {
    var found = _.find(this.checklistVersions, function(item) {
      return item._id == id;
    });

    if (found) {
      return btoa(escape(encodeURIComponent(JSON.stringify(found))));
    }

    return '';
  },
  getChecklistVersionObject: function(id) {
    return _.find(this.checklistVersions, function(item) {
      return item._id == id;
    });
  },
  addChecklistVersionObject: function(versionInfo) {
    var found = _.find(this.checklistVersions, function(item) {
      return item._id == versionInfo._id;
    });

    if (!found) {
      this.checklistVersions.push(versionInfo);
    }
  },
  setDeviceName: function(dn) {
    this.deviceName = dn;
  },
  getDeviceName: function() {
    return this.deviceName;
  },
  /*
	setLastCheckpointSerialNumber: function (lsn) {
		this.lastCheckpointSerialNumber = lsn;
	},
	getLastCheckpointSerialNumber: function () {
		return this.lastCheckpointSerialNumber;
	},
	*/
  getChecklists: function(callback) {
    var self = this;

    if (AppObserver.token) {
      if ((self.cachePack == "" || self.cachePack == undefined) && checklists == undefined) {
        //$("#data-temp").append("Loading from web for some ungodly reason! CachePack: " + self.cachePack);
        $.ajax({
          type: "get",
          dataType: "json",
          url: host + "services/ajax/aircraft/checklists?token=" + AppObserver.token + "&timestamp=" + Date.now(),
          success: function(data) {
            var response = data;

            if (response.success == true) {
              checklists = response.records;

              for (var i = 0; i < checklists.length; i++) {
                var item = checklists[i];

                item.lastPosition = undefined;
              }

              //var temp = JSON.stringify(checklists);
              //$("#data-temp2").html(temp);

              callback.call(self, true, checklists);
            } else {
              callback.call(self, false, []);
            }
          },
          error: function() {
            callback.call(self, false, []);
          }
        });
      } else if ((self.cachePack != undefined && self.cachePack != '') && checklists == undefined) {
        try {
          //601 - Fixed issue with callback not being properly issued
          //var temp = decodeURIComponent(unescape(self.cachePack));
          //checklists = JSON.parse(temp);
          checklists = self.cachePack;

          for (var i = 0; i < checklists.length; i++) {
            var item = checklists[i];

            if (!item.lastPosition)
              item.lastPosition = undefined;
          }

          callback.call(self, true, checklists);
        } catch (e) {
          checklists = undefined;
          self.cachePack = undefined;
          self.getChecklists(callback);
        }
      } else {
        $.ajax({
          type: "get",
          dataType: "json",
          url: host + "services/ajax/aircraft/checklists?token=" + AppObserver.token + "&timestamp=" + Date.now(),
          success: function(data) {
            var response = data;

            if (response.success == true) {
              checklists = response.records;

              for (var i = 0; i < checklists.length; i++) {
                var item = checklists[i];

                item.lastPosition = undefined;
              }

              callback.call(self, true, checklists);
            } else {
              callback.call(self, false, []);
            }
          },
          error: function() {
            callback.call(self, false, []);
          }
        });
      }
    } else {
      callback.call(self, false, []);
    }
  },
  getUserProducts: function(callback) {
    var self = this;
    $.ajax({
      type: "get",
      dataType: "json",
      url: host + "services/ajax/user/products?token=" + self.token + "&timestamp=" + Date.now(),
      success: function(data) {
        var response = data;

        if (response.success) {
          self.set('userProducts', response.records);

          callback.call(self, true, self.userProducts);
        } else {
          callback.call(self, false, []);
        }
      },
      error: function() {
        callback.call(self, false, []);
      }
    });
  },
  getAllProducts: function(callback) {
    var self = this;
    $.ajax({
      type: "get",
      dataType: "json",
      url: host + "services/ajax/aircraft/products?token=" + self.token + "&timestamp=" + Date.now(),
      success: function(data) {
        var response = data;

        if (response.success) {
          var allItems = response.records;

          self.getUserProducts(function(success, items) {
            for (var i = 0; i < allItems.length; i++) {
              var item = allItems[i];

              item.userOwnsProduct = false;
            }

            if (success) {
              for (var i = 0; i < items.length; i++) {
                var userItem = items[i];

                var foundProduct = _.find(allItems, function(item) {
                  if (item._id == userItem._id)
                    return true;
                });

                if (foundProduct != undefined)
                  foundProduct.userOwnsProduct = true;
              }
            }

            self.set('allProducts', allItems);

            callback.call(self, true, self.allProducts);
          });
        } else {
          callback.call(self, false, []);
        }
      },
      error: function() {
        callback.call(self, false, []);
      }
    });
  },
  load: function() {
    var self = this;

    $(window).tap(function(e) {
      e.stopPropagation();
      e.preventDefault();
      //ChecklistObserver.set('showSections', false);
    });

    /*
         $(window).swipe({
         swipeRight: function(event, duration) {
         MenuObserver.close();
         },
         swipeLeft: function(event, duration) {
         MenuObserver.open();
         },
         threshold: 100,
         durationThreshold: 265
         });
         */

    $(".submit").tap(function(e) {
      $(this).closest('form').submit();
      $('input').blur();
    });

    $('.scrollable').bind('touchmove', function(e) {
      e.stopPropagation();
    })

    /*$(".scrollable").touchScroll({
            direction:"vertical",
            threshold:25,
            onBeforeScroll:function (e) {
                if (AppObserver.isSorting) {
                    $(this).touchScroll("disable");
                }
                else {
                    $(this).touchScroll("enable");
                }
            }
        });*/

    $(".scrollable").scrollbar(function() {
      if (this.hasClass('dashboard-planes-selector')) {
        if (DashboardObserver.dataSource.page() < DashboardObserver.dataSource.pages()) {
          DashboardObserver.dataSource.pageAndAppend(DashboardObserver.dataSource.page() + 1);
          setTimeout(function() {
            DashboardObserver.onDataSourceRead();
          }, 100);
        }
      } else if (this.hasClass('checklist')) {
        if (ChecklistObserver.itemsDataSource.page() < ChecklistObserver.itemsDataSource.pages()) {
          ChecklistObserver.itemsDataSource.pageAndAppend(ChecklistObserver.itemsDataSource.page() + 1);
          ChecklistObserver.renderNew();
        } else {
          if (ChecklistObserver.list != 'emergencies') {
            ChecklistObserver.set('displayNext', true);
          }
        }
      } else if (this.hasClass('downloads')) {
        if (StoreObserver.dataSource.page() < StoreObserver.dataSource.pages()) {
          StoreObserver.dataSource.pageAndAppend(StoreObserver.dataSource.page() + 1);
          setTimeout(function() {
            StoreObserver.onDataSourceRead();
          }, 100);
        } else {
          StoreObserver.set('displayRequestModel', true);
        }
      }
    });

    $("#checklist-items").sortable({
      handle: ".handle",
      scroll: true,
      axis: "y",
      stop: function(event, ui) {
        AppObserver.isSorting = false;
        $("#checklist-items").children().each(function(index, item) {
          var id = $(this).attr("data-id");

          for (var i = 0; i < ChecklistObserver.items.length; i++) {
            var item = ChecklistObserver.items.elementAt(i);

            if (item._id == id) {
              ChecklistObserver.set('modified', true);
              item.set('index', index);
              break;
            }
          }
        });

        if (!_.isEqual(ChecklistObserver.checklist._unmodified, ChecklistObserver.checklist._original)) {
          var versionInfo = AppObserver.getChecklistVersionObject(ChecklistObserver.checklist._id);

          if (versionInfo) {
            versionInfo.lastCheckpointSerialNumber = (new Date()).getTime();
            setTimeout(function() {
              Sync.syncVersionInfoToPhone([versionInfo]);
            }, 500);
          }
        }
      },
      sort: function(event, ui) {

      },
      start: function(event, ui) {
        AppObserver.isSorting = true;
      }
    });
    $("#checklist-items").disableSelection();

    $("#dashboard-planes").sortable({
      handle: ".handle",
      scroll: true,
      axis: "y",
      stop: function(event, ui) {
        AppObserver.isSorting = false;
        //var indices = new Array();
        zimoko.Async.each($("#dashboard-planes").children(), function(index, item) {
          var id = $(this).attr("data-id");

          for (var i = 0; i < DashboardObserver.items.length; i++) {
            var item = DashboardObserver.items.elementAt(i);

            if (item._id == id) {
              item.set('index', index);
              break;
            }
          }
        });
      },
      start: function(event, ui) {
        AppObserver.isSorting = true;
      }
    });
    $("#dashboard-planes").disableSelection();

    this.set('loading', true);

    /*if(reachability) {
         this.getAllProducts(function(success, items) {
         this.set('storeHasItems', success);
         });
         }*/

    this.getChecklists(function(success, items) {
      if (success) {
        DashboardDataSource.data(items);
        DashboardObserver.set('dataSource', DashboardDataSource);

        if (items.length == 0) {
          AppObserver.set('loading', true);
          StoreObserver.set('displayRequestModel', false);
          if (reachability) {
            AppObserver.getAllProducts(function(success, items) {
              AppObserver.set('storeHasItems', success);

              if (success) {
                AppObserver.set('loading', false);
                Navigation.go('#downloads');
              } else {
                AppObserver.set('loading', false);
                if (AppObserver.token) {
                  var dialog = new Dialog('#infobox', 'Cannot connect to the Qref store, because you need to sign out and sign back in, in order to re-authenticate with our servers.');
                  dialog.show();
                } else {
                  var dialog = new Dialog('#infobox', 'You must be signed in to access the store');
                  dialog.show();
                }
              }
            });
          } else {
            AppObserver.set('loading', false);
            var dialog = new Dialog('#infobox', 'No  Connection Available');
            dialog.show();
          }
        }
      }

      self.set('loading', false);

      /*if(AppObserver.cachePack != '' && AppObserver.cachePack != undefined) {
             setTimeout(function() {
             Sync.sync();
             }, 100);
             }
             else if (success && (AppObserver.cachePack == '' || AppObserver.cachePack == undefined)) {
             Sync.syncLocal();
             }*/
      //Sync.syncLocal();
    });

    var utcTimer = new Timer(1000, function() {
      var now = new Date();

      var currentDate = new Date();
      var day = currentDate.getUTCDate();
      var month = currentDate.getUTCMonth() + 1;
      var year = currentDate.getUTCFullYear();
      var hour = currentDate.getUTCHours();
      var minute = currentDate.getUTCMinutes();
      var seconds = currentDate.getUTCSeconds();
      $(".utcCurrent").html('<span class="e6bDate">' + month + "/" + day + "/" + year + '</span>' + hour + ":" + minute + ":" + seconds + ' Z');

      //$(".utcCurrent").html(now.toUTCString());
    });

    utcTimer.start();

    $(document).bind('navigatedTo', function(e, data) {
      self.set('navHash', data.area);

      //601 - Remove editing mode on specific navigations
      if (data.area == '#checklist' && data.previous == '#editadd') {
        //Do nothing
      } else if (data.area == '#editadd' && data.previous == '#checklist') {
        //Do nothing
      } else if (data.area == '#dashboard' && data.previous == '#edittail') {
        //Do nothing
      } else if (data.area == '#edittail' && data.previous == '#dashboard') {
        //Do nothing
      } else {
        if (ChecklistObserver.editing && ChecklistObserver.modified) {
          if (ChecklistObserver.checklist._original._id != '5252fe02b2325732290016ed') {
            Sync.syncOneLocal(ChecklistObserver.checklist._original);
            ChecklistObserver.set('modified', false);
          }
        }

        ChecklistObserver.set('editing', false);
        DashboardObserver.set('editing', false);
      }

    });

    $('#checklist .checklist').scroll(function(e) {
      if (ChecklistObserver.checklist) {
        ChecklistObserver.checklist.lastPosition.scroll = $('#checklist .checklist').scrollTop();
      }
    });
  }
});

AppObserver.subscribe('token', AppObserver);
AppObserver.subscribe('reachable', AppObserver);
AppObserver.subscribe('email', AppObserver);
AppObserver.subscribe('allProducts', AppObserver);
AppObserver.subscribe('navHash', AppObserver);

var DashboardDataSource = new zimoko.DataSource({
  pageSize: 20
});

var DashboardObserver = new zimoko.Observable({
  items: new zimoko.ObservableCollection(),
  showHelp: true,
  itemTap: function(element, e, data) {
    var ele = $(element);

    e.stopPropagation();
    e.preventDefault();

    ele = ele.find('.delete');

    $('#dashboard .holder').stop().animate({
      'left': '0px'
    }, 200);
    $('#dashboard .delete').stop().animate({
      'left': '-200px'
    }, 200, function() {
      $('#dashboard .delete').hide();
    });

    if (!DashboardObserver.editing) {
      setTimeout(function() {
        ChecklistObserver.set('checklist', data)
      }, 10);

      setTimeout(function() {
        Navigation.go('#checklist');
      }, 10);
    } else if (DashboardObserver.editing) {
      EditTailObserver.set('item', data);

      Navigation.go('#edittail');
    }
  },
  navTap: function(element, e, data) {
    var ele = $(element);

    e.stopPropagation();
    e.preventDefault();

    if (ele.attr('data-link') == 'downloads') {
      AppObserver.set('loading', true);
      StoreObserver.set('displayRequestModel', false);
      if (reachability) {
        AppObserver.getAllProducts(function(success, items) {
          AppObserver.set('storeHasItems', success);

          if (success) {
            AppObserver.set('loading', false);
            Navigation.go('#' + ele.attr('data-link'));
          } else {
            AppObserver.set('loading', false);
            if (AppObserver.token) {
              var dialog = new Dialog('#infobox', 'Cannot connect to the Qref store, because you need to sign out and sign back in, in order to re-authenticate with our servers.');
              dialog.show();
            } else {
              var dialog = new Dialog('#infobox', 'You must be signed in to access the store');
              dialog.show();
            }
          }
        });
      } else {
        AppObserver.set('loading', false);
        var dialog = new Dialog('#infobox', 'No  Connection Available');
        dialog.show();
      }
    } else {
      Navigation.go('#' + ele.attr('data-link'));
    }
  },
  itemSwipeRight: function(element, e, data) {
    var ele = $(element);

    $('#dashboard .holder').stop().animate({
      'left': '0px'
    }, 200);
    $('#dashboard .delete').hide();

    e.stopPropagation();
    e.preventDefault();

    var deleteB = ele.find('.delete');
    var handle = ele.find('.holder');

    if (DashboardObserver.editing) {
      handle.animate({
        'left': '75px'
      }, 200);
      deleteB.css({
        'left': '-200px'
      });
      deleteB.show();
      deleteB.stop().animate({
        'left': '0px'
      }, 400);
    }
  },
  subItemTap: function(element, e, data) {
    if (!DashboardObserver.editing) {
      e.stopPropagation();
      e.preventDefault();

      var dataid = data._id;
      var ele = $(element);

      var datalink = ele.attr('data-link');

      var lp = undefined

      if (datalink == 'last' && data.lastPosition) {
        lp = data.lastPosition;
      }

      $('.scrollable').stop();

      $('#checklist .checklist').scrollTop(0);

      setTimeout(function() {
        ChecklistObserver.set('checklist', data);
      }, 10);

      setTimeout(function() {
        if (lp && datalink == 'last') {
          setTimeout(function() {
            ChecklistObserver.set('list', lp.list);

            setTimeout(function() {
              ChecklistObserver.set('category', lp.category);

              setTimeout(function() {
                ChecklistObserver.set('section', lp.section);
              }, 100);
            }, 100);
          }, 100);
        } else {
          ChecklistObserver.set('section', 0);
          ChecklistObserver.set('list', datalink);
        }

        setTimeout(function() {
          if (datalink == 'emergencies') {
            Navigation.go('#emergencies');
          } else {
            Navigation.go('#checklist');
          }
        }, 250);
      }, 100);
    }
  },
  deleteTap: function(element, e, data) {
    var ele = $(element);

    e.stopPropagation();
    e.preventDefault();

    ele.fadeOut(200, function() {
      ele.prev().animate({
        'left': '0px'
      }, 200, function() {
        data.set('isDeleted', true);
        data._original.isDeleted = true;

        setTimeout(function() {
          Sync.syncOneLocal(data._original);
        }, 100);

        if (!_.isEqual(data._unmodified, data._original)) {
          var versionInfo = AppObserver.getChecklistVersionObject(data._id);

          if (versionInfo) {
            versionInfo.lastCheckpointSerialNumber = (new Date()).getTime();
            setTimeout(function() {
              Sync.syncVersionInfoToPhone([versionInfo]);
            }, 500);
          }
        }

        DashboardObserver.dataSource.remove(data);
      });
    });
  },
  editTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();

    setTimeout(function() {
      DashboardObserver.set('editing', !DashboardObserver.editing);
    }, 200);
  },
  menuTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    MenuObserver.toggle();
  },
  dataSource: new zimoko.DataSource({
    pageSize: 30
  }),
  editing: false,
  token: undefined,
  onPropertyChanged: function(sender, property) {
    if (property == 'editing') {
      if (!this.editing) {
        $('#dashboard-planes li .delete').each(function() {
          var ele = $(this);

          ele.stop().animate({
            'left': '-200px'
          }, 200, function() {
            $(this).hide();
          });
          ele.prev().animate({
            'left': '0px'
          }, 200);
        });
      }
    } else if (property == 'dataSource') {
      if (this.dataSource != undefined) {
        this.dataSource.preventRead = true;
        this.dataSource.sort(new zimoko.Sort(['manufacturer.name', 'model.name', 'index'], 'asc'));
        this.dataSource.filter(new zimoko.FilterSet('and', [
          new zimoko.Filter('eq', 'isDeleted', false, false)
        ]));

        this.dataSource.unsubscribe(this);
        this.dataSource.subscribe(this);

        if (this.dataSource.view().length > 0)
          this.set('showHelp', false);
        else
          this.set('showHelp', true);

        var _this = this;

        setTimeout(function() {
          _this.set('items', _this.dataSource.view());
          setTimeout(function() {
            _this.onDataSourceRead();
          }, 100);
        }, 250);
      } else {
        this.dataSource = new zimoko.DataSource({
          pageSize: 20
        });
        this.dataSource.preventRead = true;
        this.dataSource.sort(new zimoko.Sort(['manufacturer.name', 'model.name', 'index'], 'asc'));
        this.dataSource.filter(new zimoko.FilterSet('and', [
          new zimoko.Filter('==', 'isDeleted', false, false)
        ]));

        this.dataSource.data([]);

        var _this = this;

        setTimeout(function() {
          _this.set('items', _this.dataSource.view());
        }, 250);
      }
    }
  },
  getImages: function(items) {
    setTimeout(function() {
      var imageProcessor = new ImageProcessor(items, "checklistlisting", true);
      imageProcessor.init();
      imageProcessor.processImages();
    }, 100);
  },
  punch: function() {
    var items = this.dataSource.view();

    setTimeout(function() {
      for (var i = 0; i < items.length; i++) {
        var item = items.elementAt(i);

        if (item != undefined) {
          var element = $('#dashboard li[data-id="' + item._id + '"]');

          if (element.length > 0) {
            element.find('.handle').punch();
          }
        }
      }
    }, 200);
  },
  onDataSourceRead: function(event) {
    var _this = this;

    setTimeout(function() {

      _this.punch();

      AppObserver.set('loading', false);
    }, 300);

    setTimeout(function() {
      var items = _this.dataSource.view();
      var imageProcessor = new ImageProcessor(items.toArray(), "checklistlisting", true);
      imageProcessor.init();
      imageProcessor.processImages();
    }, 300);
  }
});

DashboardObserver.subscribe('editing', DashboardObserver);
DashboardObserver.subscribe('dataSource', DashboardObserver);

var ChecklistObserver = new zimoko.Observable({
  items: new zimoko.ObservableCollection(),
  sections: [],
  checklist: undefined,
  section: 0,
  category: 0,
  modified: false,
  sectionName: '',
  list: 'preflight',
  displayNext: false,
  editing: false,
  canCheck: false,
  nextSectionText: 'Next Section',
  previousSectionText: 'Previous Section',
  showSections: false,
  itemsDataSource: new zimoko.DataSource({
    pageSize: 20
  }),
  sectionsDataSource: new zimoko.DataSource({
    pageSize: 1000
  }),
  onPropertyChanged: function(sender, property) {
    if (property == 'checklist') {
      if (this.checklist != undefined) {
        var _this = this;
        this.itemsDataSource.sort(new zimoko.Sort(['index'], 'asc'));
        this.items = this.itemsDataSource.view();

        var listIsDefault = (this.list == 'preflight');
        var categoryIsDefault = (this.category == 0);
        var sectionIsDefault = (this.section == 0);

        this.set('list', 'preflight');
        this.set('category', 0);
        this.set('section', 0);

        for (var i = 0; i < this.items.length; i++) {
          var item = this.items.elementAt(i);

          item.detach();
        }

        this.itemsDataSource.clear();

        var shouldReindex = false;

        for (var i = 0; i < this.checklist[this.list][this.section].items.length; i++) {
          var item = this.checklist[this.list][this.section].items[i];

          if (!item.isChecked)
            item.isChecked = false;

          if(item.index > this.checklist[this.list][this.section].items.length)
            shouldReindex = true;
        }

        if(shouldReindex) {
          this.checklist[this.list][this.section].items = this.checklist[this.list][this.section].items.sort(function(item1,item2) {
            if(item1.index < item2.index) {
              return -1;
            }
            else if(item1.index > item2.index) {
              return 1;
            }
            else {
              return 0;
            }
          });

          for (var i = 0; i < this.checklist[this.list][this.section].items.length; i++) {
            var item = this.checklist[this.list][this.section].items[i];

            item.index = i;
          }
        }

        this.itemsDataSource.data(this.checklist[this.list][this.section].items);

        this.render();

        if (this.itemsDataSource.page() < this.itemsDataSource.pages()) {
          this.set('displayNext', false);
        } else {
          this.set('displayNext', true);
        }

        this.set('sectionName', this.checklist[this.list][this.section].name);

        EmergenciesObserver.set('emergencies', this.checklist.emergencies.toObservableObjects());

        $('#checklist-nav li').removeClass('active');
        $('#checklist-nav li[data-link="' + this.list + '"]').addClass('active');

        this.checklist.set('lastPosition', {
          section: this.section,
          list: this.list,
          scroll: 0
        });

        if (listIsDefault && categoryIsDefault && sectionIsDefault) {
          if (this.list != 'emergencies') {
            this.set('sections', this.checklist[this.list].toObservableObjects());
          } else {
            this.set('sections', this.checklist[this.list][this.category].items.toObservableObjects());
          }
        }

        $('.scrollable').stop().scrollTop(0);

        setTimeout(function() {
          $('#checklist .checklist').scrollTop(0);
        }, 250);
      } else {
        this.set('list', 'preflight');
        this.set('section', 0);
        this.set('category', 0);
      }
    } else if (property == 'canCheck') {
      if (this.canCheck) {
        $('#checkingCheckbox')[0].checked = true;
      } else {
        $('#checkingCheckbox')[0].checked = false;
      }
    } else if (property == 'list' || property == 'section' || property == 'category') {
      var _this = this;

      if (property == 'list') {
        this.section = 0;
        this.category = 0;
      }

      if (property == 'category') {
        this.section = 0;
      }

      if (this.checklist) {
        if (this.list != 'emergencies') {
          this.set('sections', this.checklist[this.list].toObservableObjects());
        } else {
          this.set('sections', this.checklist[this.list][this.category].items.toObservableObjects());
        }
      }

      if (this.list == 'emergencies') {
        //console.log("Category Index: " + this.category);
        this.itemsDataSource.clear();

        if (this.checklist) {
          var shouldReindex = false;
          for (var i = 0; i < this.checklist[this.list][this.category].items[this.section].items.length; i++) {
            var item = this.checklist[this.list][this.category].items[this.section].items[i];

            if (!item.isChecked)
              item.isChecked = false;

            if(item.index > this.checklist[this.list][this.category].items[this.section].items.length) {
              shouldReindex = true;
            }
          }

          if(shouldReindex) {
            this.checklist[this.list][this.category].items[this.section].items = this.checklist[this.list][this.category].items[this.section].items.sort(function(item1, item2){
              if(item1.index < item2.index) {
                return -1;
              }
              else if(item1.index > item2.index) {
                return 1;
              }
              else {
                return 0;
              }
            });

            for (var i = 0; i < this.checklist[this.list][this.category].items[this.section].items.length; i++) {
              var item = this.checklist[this.list][this.category].items[this.section].items[i];

              item.index = i;
            }
          }

          this.itemsDataSource.data(this.checklist[this.list][this.category].items[this.section].items);

          this.set('sectionName', this.checklist[this.list][this.category].items[this.section].name);
        }

        this.render();
      } else {
        this.itemsDataSource.clear();

        if (this.checklist) {
          var shouldReindex = false;
          for (var i = 0; i < this.checklist[this.list][this.section].items.length; i++) {
            var item = this.checklist[this.list][this.section].items[i];

            if (!item.isChecked)
              item.isChecked = false;

            if(item.index > this.checklist[this.list][this.section].items.length) {
              shouldReindex = true;
            }
          }

          if(shouldReindex) {
            this.checklist[this.list][this.section].items = this.checklist[this.list][this.section].items.sort(function(item1,item2) {
              if(item1.index < item2.index) {
                return -1;
              }
              else if(item1.index > item2.index) {
                return 1;
              }
              else {
                return 0;
              }
            });

            for (var i = 0; i < this.checklist[this.list][this.section].items.length; i++) {
              var item = this.checklist[this.list][this.section].items[i];

              item.index = i;
            }
          }

          this.itemsDataSource.data(this.checklist[this.list][this.section].items);

          this.set('sectionName', this.checklist[this.list][this.section].name);
        }

        this.render();
      }

      if (this.itemsDataSource.page() < this.itemsDataSource.pages()) {
        this.set('displayNext', false);
      } else {
        this.set('displayNext', true);
      }

      $('.scrollable').stop().scrollTop(0);

      $('#checklist-nav li').removeClass('active');
      $('#checklist-nav li[data-link="' + this.list + '"]').addClass('active');

      if (this.checklist)
        this.checklist.set('lastPosition', {
          section: this.section,
          category: this.category,
          list: this.list,
          scroll: 0
        });

      /*setTimeout(function() {
             ChecklistObserver.previousSectionTextGenerate();
             ChecklistObserver.nextSectionTextGenerate();
             }, 10);*/
    } else if (property == 'editing') {
      if (!this.editing) {
        $('#checklist .checklist li .delete').each(function() {
          var ele = $(this);

          ele.stop().animate({
            'left': '-200px'
          }, 200, function() {
            $(this).hide();
          });
          ele.prev().animate({
            'left': '0px'
          }, 200);
        });
      }
    }
  },
  renderNew: function() {
    var _this = this;
    var checklistArea = $('#checklist-items');

    if (!checklistArea.data('template'))
      checklistArea.data('template', $(checklistArea.html()));

    for (var i = 0; i < this.items.length; i++) {
      var item = this.items.elementAt(i);

      if (item) {
        var element = checklistArea.find('[data-id="' + item._id + '"]');

        if (element.length == 0) {
          item.parent = this;

          var template = checklistArea.data('template').clone();

          template.attr('data-id', item._id);

          template.find('.check').html(item.check);

          if (item.response == '')
            template.find('.check').addClass('fullwidth');

          template.find('.response').html(item.response);
          template.find('.handle').hide();

          checklistArea.append(template);

          item.attach(template);
        }
      }
    }

    _this.onDataSourceRead();
  },
  render: function() {
    var _this = this;
    var checklistArea = $('#checklist-items');

    if (!checklistArea.data('template'))
      checklistArea.data('template', $(checklistArea.html()));

    for (var i = 0; i < this.items.length; i++) {
      var item = this.items.elementAt(i);

      if (item) {
        item.detach();
      }
    }

    checklistArea.html('');

    for (var i = 0; i < this.items.length; i++) {
      var item = this.items.elementAt(i);
      if (item) {
        item.parent = this;

        var template = checklistArea.data('template').clone();

        template.attr('data-id', item._id);

        template.find('.check').html(item.check);

        if (item.response == '')
          template.find('.check').addClass('fullwidth');

        template.find('.response').html(item.response);
        template.find('.handle').hide();

        checklistArea.append(template);
      }
    }

    if (this.items.length == 0 && this.editing)
      $('.checklist .add-single').show();
    else
      $('.checklist .add-single').hide();

    setTimeout(function() {
      for (var i = 0; i < _this.items.length; i++) {
        var item = _this.items.elementAt(i);
        if (item) {
          var element = checklistArea.find('[data-id="' + item._id + '"]');

          if (element.length > 0) {
            if (item) {
              item.attach(element);
            }
          }
        }
      }

      _this.onDataSourceRead();
    }, 1);
  },
  clearTap: function(element, e, data) {
    var checklist = ChecklistObserver.checklist;

    var preflight = checklist.preflight;
    var takeoff = checklist.takeoff;
    var landing = checklist.landing;
    var emergencies = checklist.emergencies;

    var dialog = new ConfirmationDialog("#clearchecks", function(result) {
      if (result) {
        ChecklistObserver.set('showSections', false);

        setTimeout(function() {
          for (var i = 0; i < ChecklistObserver.items.length; i++) {
            ChecklistObserver.items.elementAt(i).set('isChecked', false);
          }
        }, 100);

        setTimeout(function() {
          for (var i = 0; i < preflight.length; i++) {
            var section = preflight[i];
            var items = section.items;

            for (var j = 0; j < items.length; j++) {
              items[j].isChecked = false;
            }
          }

          for (var i = 0; i < takeoff.length; i++) {
            var section = takeoff[i];
            var items = section.items;

            for (var j = 0; j < items.length; j++) {
              items[j].isChecked = false;
            }
          }

          for (var i = 0; i < landing.length; i++) {
            var section = landing[i];
            var items = section.items;

            for (var j = 0; j < items.length; j++) {
              items[j].isChecked = false;
            }
          }

          for (var i = 0; i < emergencies.length; i++) {
            var category = emergencies[i].items;

            for (var j = 0; j < category.length; j++) {
              var section = category[j].items;

              for (s = 0; s < section.length; s++) {
                section[s].isChecked = false;
              }
            }
          }

        }, 100);
      }
    });

    dialog.show();
  },
  checkTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    ChecklistObserver.set('showSections', false);

    if (data.isChecked) {
      data.set('isChecked', false);
    } else {
      data.set('isChecked', true);
    }
  },
  previousSectionTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();

    $('.scrollable').stop();

    $('#checklist .checklist').scrollTop(0);

    ChecklistObserver.set('showSections', false);

    if (ChecklistObserver.section - 1 >= 0) {
      ChecklistObserver.set('section', ChecklistObserver.section - 1);
    } else {
      if (ChecklistObserver.list == 'emergencies') {
        if (ChecklistObserver.category - 1 >= 0) {
          ChecklistObserver.set('category', ChecklistObserver.category - 1);
        } else {
          ChecklistObserver.list = 'landing';
        }
      } else if (ChecklistObserver.list == 'landing')
        ChecklistObserver.list = 'takeoff';
      else if (ChecklistObserver.list == 'takeoff')
        ChecklistObserver.list = 'preflight';

      if (ChecklistObserver.list == 'emergencies') {
        ChecklistObserver.set('section', ChecklistObserver.checklist[ChecklistObserver.list][ChecklistObserver.category].items.length - 1);
      } else {
        ChecklistObserver.set('section', ChecklistObserver.checklist[ChecklistObserver.list].length - 1);
      }
    }
  },
  nextSectionTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();

    $('.scrollable').stop();

    $('#checklist .checklist').scrollTop(0);

    ChecklistObserver.set('showSections', false);

    if (ChecklistObserver.list == 'emergencies' && ChecklistObserver.section + 1 < ChecklistObserver.checklist[ChecklistObserver.list][ChecklistObserver.category].items.length) {
      ChecklistObserver.set('section', ChecklistObserver.section + 1);
    } else if (ChecklistObserver.list != 'emergencies' && ChecklistObserver.section + 1 < ChecklistObserver.checklist[ChecklistObserver.list].length) {
      ChecklistObserver.set('section', ChecklistObserver.section + 1);
    } else {
      if (ChecklistObserver.list == 'preflight')
        ChecklistObserver.set('list', 'takeoff');
      else if (ChecklistObserver.list == 'takeoff')
        ChecklistObserver.set('list', 'landing');
      else if (ChecklistObserver.list == 'landing')
        ChecklistObserver.set('list', 'emergencies');
      else if (ChecklistObserver.list == 'emergencies') {
        if (ChecklistObserver.category + 1 < ChecklistObserver.checklist[ChecklistObserver.list].length)
          ChecklistObserver.set('category', ChecklistObserver.category + 1);
      }

      ChecklistObserver.set('section', 0);
    }

    ChecklistObserver.set('showSections', false);
  },
  onDataSourceChange: function(event) {
    var self = this;

    setTimeout(function() {
      for (var i = 0; i < self.items.length; i++) {
        var item = self.items.elementAt(i);

        if (item != undefined) {
          var element = $('#checklist li[data-id="' + item._id + '"]');

          if (element.length > 0) {
            element.find('.handle').punch();
          }
        }
      }
    }, 300);
  },
  onDataSourceRead: function(event) {
    var self = this;
    AppObserver.set('loading', false);

    setTimeout(function() {
      for (var i = 0; i < self.items.length; i++) {
        var item = self.items.elementAt(i);

        if (item != undefined) {
          var element = $('#checklist li[data-id="' + item._id + '"]');

          if (element.length > 0) {
            element.find('.handle').punch();
          }
        }
      }
    }, 300);
  },
  editTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();

    if (ChecklistObserver.editing && ChecklistObserver.modified) {
      if (ChecklistObserver.checklist._original._id != '5252fe02b2325732290016ed') {
        Sync.syncOneLocal(ChecklistObserver.checklist._original);
        ChecklistObserver.set('modified', false);
      }
    }

    setTimeout(function() {
      ChecklistObserver.set('editing', !ChecklistObserver.editing);

      if (ChecklistObserver.editing && ChecklistObserver.items.length == 0) $('.checklist .add-single').show();
    }, 60);

    ChecklistObserver.set('showSections', false);
  },
  menuTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    MenuObserver.toggle();
    ChecklistObserver.set('showSections', false);
  },
  addTap: function(element, e, data) {
    var index = -1;

    if (data.index)
      index = data.index;

    e.stopPropagation();
    e.preventDefault();
    ChecklistObserver.set('showSections', false);

    EditAddObserver.set('item', new zimoko.Observable({
      check: '',
      response: '',
      icon: null,
      isChecked: false,
      index: 0,
      _id: new ObjectId().toString()
    }));

    EditAddObserver.set('adding', true);

    EditAddObserver.set('index', index);

    ChecklistObserver.set('showSections', false);

    Navigation.go('#editadd');
    $('#editAddCheck').focus();
  },
  itemSwipeRight: function(element, e, data) {
    var ele = $(element);

    $('#checklist .holder').stop().animate({
      'left': '0px'
    }, 200);
    $('#checklist .delete').hide();

    e.stopPropagation();
    e.preventDefault();
    ChecklistObserver.set('showSections', false);

    var deleteB = ele.find('.delete');
    var holder = ele.find('.holder');

    if (ChecklistObserver.editing) {
      holder.animate({
        'left': '75px'
      }, 200);
      deleteB.css({
        'left': '-200px'
      });
      deleteB.show();
      deleteB.stop().animate({
        'left': '0px'
      }, 400);
    }
  },
  deleteTap: function(element, e, data) {
    var ele = $(element);

    e.stopPropagation();
    e.preventDefault();
    ChecklistObserver.set('showSections', false);

    if (ChecklistObserver.editing) {
      ele.fadeOut(200, function() {
        ele.prev().animate({
          'left': '0px'
        }, 200, function(e) {
          var index = ChecklistObserver.checklist[ChecklistObserver.list][ChecklistObserver.section].items.indexOf(data._original);

          ChecklistObserver.itemsDataSource.remove(data);

          $('#checklist li[data-id="' + data._id + '"]').remove();

          data.detach();

          if (index > -1) {
            ChecklistObserver.set('modified', true);
            ChecklistObserver.checklist[ChecklistObserver.list][ChecklistObserver.section].items.removeAt(index);

            if (!_.isEqual(ChecklistObserver.checklist._unmodified, ChecklistObserver.checklist._original)) {
              var versionInfo = AppObserver.getChecklistVersionObject(ChecklistObserver.checklist._id);

              if (versionInfo) {
                versionInfo.lastCheckpointSerialNumber = (new Date()).getTime();
                setTimeout(function() {
                  Sync.syncVersionInfoToPhone([versionInfo]);
                }, 500);
              }
            }
          }

          if (ChecklistObserver.items.length == 0)
            $('.checklist .add-single').show();
          else
            $('.checklist .add-single').hide();
        });
      });
    }
  },
  itemTap: function(element, e, data) {
    var ele = $(element);

    e.stopPropagation();
    e.preventDefault();
    ChecklistObserver.set('showSections', false);
    ele = ele.find('.delete');

    $('#checklist .holder').stop().animate({
      'left': '0px'
    }, 200);
    $('#checklist .delete').stop().animate({
      'left': '-200px'
    }, 200, function() {
      $('#checklist .delete').hide();
    });

    if (ChecklistObserver.editing) {
      EditAddObserver.set('adding', false);
      EditAddObserver.set('item', data);
      EditAddObserver.set('index', data.index);

      Navigation.go('#editadd');
      $('#editAddCheck').focus();
    } else {
      if (ChecklistObserver.canCheck) {
        data.set('isChecked', !data.isChecked);
      }
    }
  },
  sectionTap: function(element, e, data) {
    $('#checklist check-sections li').removeClass('active');
    var ele = $(element);

    e.stopPropagation();
    e.preventDefault();

    ele.addClass('active');

    ChecklistObserver.set('showSections', false);

    setTimeout(function() {
      ChecklistObserver.set('section', data.index);
    }, 300);
  },
  sectionsTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    ChecklistObserver.set('showSections', !ChecklistObserver.showSections);
  },
  backTap: function(element, e, data) {
    e.stopPropagation();
    e.preventDefault();
    ChecklistObserver.set('showSections', false);

    setTimeout(function() {
      if (ChecklistObserver.list != "emergencies") {
        if (AppObserver.token) {
          Navigation.go("dashboard");
        } else {
          Navigation.go('#marketing');
        }
      } else {
        Navigation.go("emergencies");
      }
    }, 50);
  }
});

ChecklistObserver.subscribe('checklist', ChecklistObserver);
ChecklistObserver.subscribe('canCheck', ChecklistObserver);
ChecklistObserver.subscribe('list', ChecklistObserver);
ChecklistObserver.subscribe('section', ChecklistObserver);
ChecklistObserver.subscribe('category', ChecklistObserver);
ChecklistObserver.subscribe('editing', ChecklistObserver);
