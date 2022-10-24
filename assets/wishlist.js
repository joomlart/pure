(function ($) {
  var $doc = $(document);

  $doc.ready(() => {
    $doc.ajaxStart(() => {
      jaShopify.isAjaxLoading = true;
    });

    $doc.ajaxStop(() => {
      jaShopify.isAjaxLoading = false;
    });

    jaShopify.ready();
  });

  window.onload = function () {
    jaShopify.init();
  }
  var jaShopify = {
    isAjaxLoading: false,

    initWishlist: function () {
      if (window.wishlist.show) {
        jashopify.setLocalStorageProductForWishlist();

        $doc.on('click', '[data-wishlist]', (event) => {
          event.preventDefault();
          event.stopPropagation();

          $('[data-wishlist-items-display]').removeClass('is-loaded');

          var $target = $(event.currentTarget),
            id = $target.data('product-id'),
            handle = $target.data('wishlist-handle'),
            wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];
          index = wishlistList.indexOf(handle),
            wishlistContainer = $('[data-wishlist-container]');
          if (!$target.hasClass('wishlist-added')) {
            $target
              .addClass('wishlist-added')
              .find('.text')
              .text(window.wishlist.added);

            if (wishlistContainer.length > 0) {
              jashopify.setProductForWishlistPage(handle);
            }

            wishlistList.push(handle);
            localStorage.setItem('wishlistItem', JSON.stringify(wishlistList));
          } else {
            $target
              .removeClass('wishlist-added')
              .find('.text')
              .text(window.wishlist.add);
            if (wishlistContainer.length > 0) {
              if ($('[data-wishlist-added="wishlist-' + id + '"]').length > 0) {
                $('[data-wishlist-added="wishlist-' + id + '"]').remove();
              }
            }

            wishlistList.splice(index, 1);
            localStorage.setItem('wishlistItem', JSON.stringify(wishlistList));
            jashopify.wishlistPagination();

            if (wishlistContainer.length > 0) {
              wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];

              if (wishlistList.length > 0) {
                jashopify.updateShareWishlistViaMail();
              } else {
                $('[data-wishlist-container]')
                  .addClass('is-empty')
                  .html(`\
                          <div class="wishlist-content-empty text-center">\
                              <span class="wishlist-content-text">${window.wishlist.empty}</span>\
                              <div class="wishlist-content-actions">\
                                  <a class="button button-2 button-continue" href="${window.routes.collection_all}">\
                                      ${window.wishlist.continue_shopping}\
                                  </a>\
                              </div>\
                          </div>\
                      `);

                $('[data-wishlist-footer]').hide();
              }
            }
          }
          $('[data-wishlist-count]').text(wishlistList.length);
          jashopify.setProductForWishlist(handle);
        });
      }
    },

    wishlistPagination: function () {
      var wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];
      var wlpaggingContainer = $('#wishlist-paginate');
      let paggingTpl

      if (window.pagination.style === 1) {
        paggingTpl = '<li class="pagination-arrow prev disabled style-1"><a href="#" class="pagination__item pagination__item--prev pagination__item-arrow link motion-reduce"><svg class="icon thin-arrow" viewBox="0 0 50 50"><path d="M 11.957031 13.988281 C 11.699219 14.003906 11.457031 14.117188 11.28125 14.308594 L 1.015625 25 L 11.28125 35.691406 C 11.527344 35.953125 11.894531 36.0625 12.242188 35.976563 C 12.589844 35.890625 12.867188 35.625 12.964844 35.28125 C 13.066406 34.933594 12.972656 34.5625 12.71875 34.308594 L 4.746094 26 L 48 26 C 48.359375 26.003906 48.695313 25.816406 48.878906 25.503906 C 49.058594 25.191406 49.058594 24.808594 48.878906 24.496094 C 48.695313 24.183594 48.359375 23.996094 48 24 L 4.746094 24 L 12.71875 15.691406 C 13.011719 15.398438 13.09375 14.957031 12.921875 14.582031 C 12.753906 14.203125 12.371094 13.96875 11.957031 13.988281 Z"></path></svg></span></a></li>';
      } else if (window.pagination.style === 2) {
        paggingTpl = '<li class="pagination-arrow prev disabled style-2"><a href="#" class="pagination__item pagination__item--prev pagination__item-arrow link motion-reduce"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"></svg></span></a></li>';
      } else {
        paggingTpl = '<li class="pagination-arrow prev disabled style-3"><a href="#" class="pagination__item pagination__item--prev pagination__item-arrow link motion-reduce"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"></svg><span class="arrow-text">' + window.pagination.prev + '</span></a></li>';
      }

      let wishlistItemDisplay = $('[data-wishlist-items-display]');
      wishlistItemDisplay.removeClass('is-loaded')
      setTimeout(() => {
        wlpaggingContainer.children().remove();
        var totalPages = Math.ceil(wishlistList.filter(item => item != null).length / 3);

        if (totalPages <= 1) {
          wishlistItemDisplay.children().show();
          wishlistItemDisplay.addClass('is-loaded');
          return;
        }

        for (var i = 0; i < totalPages; i++) {
          var pageNum = i + 1;
          if (i === 0) paggingTpl += '<li class="active pagination-num"><a class="pagination__item link" data-page="' + pageNum + '" href="' + pageNum + '" title="' + pageNum + '">' + pageNum + '</a></li>'
          else paggingTpl += '<li class="pagination-num"><a class="pagination__item link" data-page="' + pageNum + '" href="' + pageNum + '" title="' + pageNum + '">' + pageNum + '</a></li>'
        }

        if (window.pagination.style === 1) {
          paggingTpl += '<li class="pagination-arrow next style-1"><a href="#" class="pagination__item pagination__item--next pagination__item-arrow link"><svg class="icon thin-arrow" viewBox="0 0 50 50"><path d="M 11.957031 13.988281 C 11.699219 14.003906 11.457031 14.117188 11.28125 14.308594 L 1.015625 25 L 11.28125 35.691406 C 11.527344 35.953125 11.894531 36.0625 12.242188 35.976563 C 12.589844 35.890625 12.867188 35.625 12.964844 35.28125 C 13.066406 34.933594 12.972656 34.5625 12.71875 34.308594 L 4.746094 26 L 48 26 C 48.359375 26.003906 48.695313 25.816406 48.878906 25.503906 C 49.058594 25.191406 49.058594 24.808594 48.878906 24.496094 C 48.695313 24.183594 48.359375 23.996094 48 24 L 4.746094 24 L 12.71875 15.691406 C 13.011719 15.398438 13.09375 14.957031 12.921875 14.582031 C 12.753906 14.203125 12.371094 13.96875 11.957031 13.988281 Z"></path></svg></span></a></li>';
        } else if (window.pagination.style === 2) {
          paggingTpl += '<li class="pagination-arrow next style-2"><a href="#" class="pagination__item pagination__item--next pagination__item-arrow link"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"></svg></span></a></li>';
        } else {
          paggingTpl += '<li class="pagination-arrow next style-3"><a href="#" class="pagination__item pagination__item--next pagination__item-arrow link"><span class="arrow-text">' + window.pagination.next + '</span><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"></svg></span></a></li>';
        }

        wlpaggingContainer.append(paggingTpl);
        wishlistItemDisplay.children().each(function (idx, elm) {
          if (idx >= 3) {
            $(elm).hide();
          }
          else {
            $(elm).show();
          }
        });

        wishlistItemDisplay.children().slice(3).css('display', 'none')

        wlpaggingContainer.off('click.wl-pagging').on('click.wl-pagging', 'li a', function (e) {
          e.preventDefault();
          var isPrev = $(this).parent().hasClass('prev');
          var isNext = $(this).parent().hasClass('next');
          var pageNumber = $(this).data('page');

          const curPage = parseInt($(this).parent().siblings('.active').children().data('page'));

          if (isPrev) {
            pageNumber = curPage - 1;
          }

          if (isNext) {
            pageNumber = curPage + 1;
          }

          wishlistItemDisplay.children().each(function (idx, elm) {
            if (idx >= (pageNumber - 1) * 3 && idx < pageNumber * 3) {
              $(elm).show();
            }
            else {
              $(elm).hide();
            }
          });

          if (pageNumber === 1) {
            wlpaggingContainer.find('.prev').addClass('disabled');
            wlpaggingContainer.find('.next').removeClass('disabled');
          }
          else if (pageNumber === totalPages) {
            wlpaggingContainer.find('.next').addClass('disabled');
            wlpaggingContainer.find('.prev').removeClass('disabled');
          }
          else {
            wlpaggingContainer.find('.prev').removeClass('disabled');
            wlpaggingContainer.find('.next').removeClass('disabled');
          }

          $(this).parent().siblings('.active').removeClass('active');
          wlpaggingContainer.find('[data-page="' + pageNumber + '"]').parent().addClass('active');
        });
        wishlistItemDisplay.addClass('is-loaded')
      }, 500)
    },

    initWishlistPage: function () {
      if (typeof (Storage) !== 'undefined') {
        var wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];
        if (wishlistList.length > 0) {
          wishlistList = JSON.parse(localStorage.getItem('wishlistItem'));
          wishlistList.forEach((handle, index) => {
            jashopify.setProductForWishlistPage(handle, index);
          });
        } else {
          $('[data-wishlist-container]')
            .addClass('is-empty')
            .html(`\
              <div class="wishlist-content-empty text-center">\
                  <span class="wishlist-content-text">${window.wishlist.empty}</span>\
                  <div class="wishlist-content-actions">\
                      <a class="button button-2 button-continue" href="${window.routes.collection_all}">\
                          ${window.wishlist.continue_shopping}\
                      </a>\
                  </div>\
              </div>\
          `);

          $('[data-wishlist-footer]').hide();
        }
        jashopify.wishlistPagination()
      } else {
        alert('Sorry! No web storage support..');
      }
    },

    setProductForWishlistPage: function (handle, index) {
      var wishlistContainer = $('[data-wishlist-container]');

      $.getJSON(window.routes.root + '/products/' + handle + '.js', (product) => {
        var productHTML = '',
          price_min = Shopify.formatMoney(product.price_min, window.money_format);

        productHTML += '<div class="wishlist-row" data-wishlist-added="wishlist-' + product.id + '" data-product-id=product-' + product.id + '">';
        productHTML += '<div class="wishlist-rowItem wishlist-image text-left">';
        productHTML += '<div class="item">';
        productHTML += '<a class="item-image" href="' + product.url + '"><img srcset="' + product.featured_image + '" alt="' + product.featured_image.alt + '"></a></div>';
        productHTML += '</div>';
        productHTML += '<div class="wishlist-rowItem wishlist-meta text-left">';
        productHTML += '<div class="item">';
        productHTML += '<div class="item-info"><a class="item-title link link-underline" href="' + product.url + '"><span class="text">' + product.title + '</span></a></div>';
        productHTML += '<a class="item-vendor" href="' + window.routes.root + '/collections/vendors?q=' + product.vendor + '">' + product.vendor + '</a>';
        productHTML += '</div></div>';
        productHTML += '<div class="wishlist-rowItem wishlist-price text-left"><div class="item-price">' + price_min + '</div></div>';
        productHTML += '<div class="wishlist-rowItem wishlist-add text-center">';
        productHTML += '<form action="/cart/add" method="post" class="variants" id="wishlist-product-form-' + product.id + '" data-id="product-actions-' + product.id + '" enctype="multipart/form-data">';

        if (product.available) {
          if (product.variants.length == 1) {
            productHTML += '<button data-btn-addToCart class="item-btn button add-to-cart-btn"data-form-id="#wishlist-product-form-' + product.id + '" type="submit">' + window.variantStrings.addToCart + '</button><input type="hidden" name="id" value="' + product.variants[0].id + '" />';
          }

          if (product.variants.length > 1) {
            productHTML += '<a class="item-btn button" title="' + product.title + '" href="' + product.url + '">' + window.variantStrings.select + '</a>';
          }
        } else {
          productHTML += '<button class="item-btn button add-to-cart-btn" type="submit" disabled>' + window.variantStrings.soldOut + '</button>';
        }

        productHTML += '</form></div>';
        productHTML += '<div class="wishlist-rowItem wishlist-remove text-center"><a class="item-remove wishlist-added" href="#" data-wishlist-handle="' + product.handle + '" data-wishlist data-product-id="' + product.id + '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M 38.982422 6.9707031 A 2.0002 2.0002 0 0 0 37.585938 7.5859375 L 24 21.171875 L 10.414062 7.5859375 A 2.0002 2.0002 0 0 0 8.9785156 6.9804688 A 2.0002 2.0002 0 0 0 7.5859375 10.414062 L 21.171875 24 L 7.5859375 37.585938 A 2.0002 2.0002 0 1 0 10.414062 40.414062 L 24 26.828125 L 37.585938 40.414062 A 2.0002 2.0002 0 1 0 40.414062 37.585938 L 26.828125 24 L 40.414062 10.414062 A 2.0002 2.0002 0 0 0 38.982422 6.9707031 z"/></svg></a></div>';
        productHTML += '</div>';

        wishlistContainer.find('.wishlist-items-display').append(productHTML);
        jashopify.updateShareWishlistViaMail();

        if (index == wishlistContainer.find('[data-wishlist-added]').length - 1) {
          jashopify.updateShareWishlistViaMail();
        }
      });
    },

    updateShareWishlistViaMail: function () {
      const regex = /(<([^>]+)>)/ig;

      var $share = $('[data-wishlist-share]'),
        href = 'mailto:?subject= Wish List&body=',
        product,
        title,
        url,
        price;

      $('[data-wishlist-added]').each((index, element) => {
        product = $(element);
        price = product.find('.item-price .money').text();
        title = product.find('.item-title .text').text();
        url = product.find('.item-title').attr('href');

        href += encodeURIComponent(title + '\nPrice: ' + price.replace(regex, '') + '\nLink: ' + window.location.protocol + '//' + window.location.hostname + url + '\n\n');
      });

      $share.attr('href', href);
    },

    setProductForWishlist: function (handle) {
      var wishlistList = JSON.parse(localStorage.getItem('wishlistItem')),
        item = $('[data-wishlist-handle="' + handle + '"]'),
        index = wishlistList.indexOf(handle);

      if (index >= 0) {
        item
          .addClass('wishlist-added')
          .find('.text')
          .text(window.wishlist.added)
      } else {
        item
          .removeClass('wishlist-added')
          .find('.text')
          .text(window.wishlist.add);
      }
    },

    setLocalStorageProductForWishlist: function () {
      var wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];
      localStorage.setItem('wishlistItem', JSON.stringify(wishlistList));

      if (wishlistList.length > 0) {
        wishlistList = JSON.parse(localStorage.getItem('wishlistItem'));

        wishlistList.forEach((handle) => {
          jashopify.setProductForWishlist(handle);
        });
      }
      $('[data-wishlist-count]').text(wishlistList.length);
    }
  }
})(jQuery);