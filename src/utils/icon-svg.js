(function(window){var svgSprite='<svg><symbol id="icon-dashboard" viewBox="0 0 1024 1024"><path d="M553.984 128l342.016 0 0 256-342.016 0 0-256zM553.984 896l0-425.984 342.016 0 0 425.984-342.016 0zM128 896l0-256 342.016 0 0 256-342.016 0zM128 553.984l0-425.984 342.016 0 0 425.984-342.016 0z"  ></path></symbol><symbol id="icon-disk" viewBox="0 0 1024 1024"><path d="M966.4 800 889.6 0l-768 0-64 806.4L57.6 1024l908.8 0L966.4 800 966.4 800zM825.6 64l64 704-768 0 64-704L825.6 64 825.6 64zM115.2 960l0-128 774.4 0 0 128L115.2 960 115.2 960z"  ></path><path d="M396.8 537.6 396.8 537.6c6.4 0 6.4 0 12.8 0l198.4 0c38.4 0 70.4-32 70.4-70.4l0 0c0-32-25.6-57.6-57.6-70.4C627.2 384 627.2 371.2 627.2 364.8c0-51.2-44.8-89.6-96-89.6C499.2 275.2 467.2 294.4 448 320 441.6 313.6 435.2 313.6 428.8 313.6c-32 0-51.2 19.2-51.2 44.8l0 0C332.8 371.2 307.2 409.6 307.2 448 307.2 499.2 345.6 537.6 396.8 537.6L396.8 537.6z"  ></path><path d="M768 857.6l64 0 0 64-64 0L768 857.6 768 857.6z"  ></path><path d="M659.2 857.6l64 0 0 64-64 0L659.2 857.6 659.2 857.6z"  ></path></symbol><symbol id="icon-database" viewBox="0 0 1024 1024"><path d="M512 825.6c-211.2 0-377.6-57.6-377.6-128l0 0L134.4 896l0 0c6.4 70.4 172.8 128 377.6 128 204.8 0 371.2-57.6 377.6-128l0 0 0-204.8 0 0C889.6 768 723.2 825.6 512 825.6L512 825.6z"  ></path><path d="M512 544c-211.2 0-377.6-57.6-377.6-128l0 0 0 204.8 0 0c6.4 70.4 172.8 128 377.6 128 204.8 0 371.2-57.6 377.6-128l0 0L889.6 416l0 0C889.6 486.4 723.2 544 512 544L512 544z"  ></path><path d="M889.6 128 889.6 128c0-70.4-166.4-128-377.6-128C300.8 0 134.4 57.6 134.4 128l0 0 0 0 0 204.8 0 0c6.4 70.4 172.8 128 377.6 128 204.8 0 371.2-57.6 377.6-128l0 0L889.6 128 889.6 128 889.6 128zM512 217.6c-153.6 0-281.6-44.8-281.6-96 0-51.2 128-96 281.6-96 153.6 0 281.6 44.8 281.6 96C793.6 179.2 665.6 217.6 512 217.6L512 217.6z"  ></path></symbol><symbol id="icon-vm" viewBox="0 0 1024 1024"><path d="M0 0l0 224 896 0L896 0 0 0zM160 160 64 160 64 64l96 0L160 160 160 160zM300.8 160 204.8 160 204.8 64l96 0L300.8 160zM448 160 352 160 352 64 448 64 448 160 448 160z"  ></path><path d="M0 288l0 224 896 0L896 288 0 288zM160 441.6 64 441.6 64 345.6l96 0L160 441.6 160 441.6zM300.8 441.6 204.8 441.6 204.8 345.6l96 0L300.8 441.6zM448 441.6 352 441.6 352 345.6 448 345.6 448 441.6 448 441.6z"  ></path><path d="M748.8 665.6c-19.2 0-32 12.8-32 32l0 140.8c0 19.2 12.8 32 32 32l128 0c19.2 0 32-12.8 32-32 0-19.2-12.8-32-32-32l-96 0 0-108.8C780.8 678.4 768 665.6 748.8 665.6z"  ></path><path d="M780.8 537.6c-44.8 0-83.2 12.8-115.2 32L0 569.6l0 224 524.8 0 44.8 57.6 89.6-115.2L601.6 736c19.2-76.8 89.6-134.4 172.8-134.4 102.4 0 179.2 83.2 179.2 179.2 0 102.4-83.2 179.2-179.2 179.2-51.2 0-102.4-25.6-140.8-64-12.8-12.8-32-12.8-44.8-6.4-12.8 12.8-12.8 32-6.4 44.8 44.8 51.2 115.2 83.2 185.6 83.2 134.4 0 243.2-108.8 243.2-243.2C1024 646.4 915.2 537.6 780.8 537.6zM160 723.2 160 723.2 64 723.2 64 627.2l96 0L160 723.2zM300.8 723.2 204.8 723.2 204.8 627.2l96 0L300.8 723.2zM448 723.2 352 723.2l0 0L352 627.2 448 627.2 448 723.2 448 723.2z"  ></path></symbol><symbol id="icon-setting" viewBox="0 0 1024 1024"><path d="M108.8 441.6C64 448 32 460.8 0 467.2c0 25.6 0 57.6 0 83.2l0 6.4C32 569.6 64 576 108.8 582.4c0 25.6 6.4 51.2 19.2 70.4-32 25.6-57.6 51.2-76.8 76.8 12.8 25.6 25.6 57.6 44.8 76.8 25.6-6.4 64-19.2 102.4-32 12.8 19.2 32 38.4 51.2 51.2-12.8 38.4-25.6 76.8-32 102.4 25.6 19.2 51.2 32 83.2 44.8C320 960 345.6 928 371.2 896c25.6 6.4 44.8 12.8 70.4 19.2C448 960 460.8 992 467.2 1024c25.6 0 57.6 0 83.2 0l6.4 0c6.4-25.6 19.2-64 25.6-102.4 25.6-6.4 51.2-12.8 70.4-19.2 25.6 32 51.2 57.6 76.8 76.8 25.6-12.8 57.6-25.6 76.8-44.8-6.4-25.6-19.2-64-32-102.4 19.2-12.8 38.4-32 51.2-51.2 38.4 12.8 76.8 25.6 102.4 32 19.2-25.6 32-51.2 44.8-83.2C960 704 928 678.4 896 652.8c6.4-25.6 12.8-44.8 19.2-70.4C960 576 992 563.2 1024 556.8c0-25.6 0-57.6 0-83.2L1024 467.2c-25.6-6.4-64-19.2-102.4-25.6-6.4-25.6-12.8-51.2-19.2-70.4C934.4 345.6 960 320 979.2 294.4c-12.8-25.6-25.6-57.6-44.8-76.8-25.6 6.4-64 19.2-102.4 32-12.8-19.2-32-38.4-51.2-51.2 12.8-38.4 25.6-76.8 32-102.4-25.6-19.2-51.2-32-83.2-44.8C704 64 678.4 96 652.8 128 627.2 115.2 608 108.8 582.4 108.8 576 64 563.2 32 556.8 0 531.2 0 499.2 0 473.6 0L467.2 0C454.4 32 448 64 441.6 108.8 416 108.8 390.4 115.2 371.2 128 339.2 96 320 70.4 294.4 44.8 268.8 64 243.2 76.8 217.6 96c6.4 25.6 19.2 64 32 102.4C230.4 211.2 211.2 230.4 198.4 249.6 153.6 236.8 121.6 224 96 217.6 76.8 243.2 57.6 268.8 44.8 300.8 64 320 89.6 345.6 128 371.2 115.2 396.8 108.8 416 108.8 441.6L108.8 441.6zM486.4 217.6c160-12.8 307.2 108.8 320 268.8 12.8 160-108.8 307.2-268.8 320-160 12.8-307.2-108.8-320-268.8C204.8 371.2 326.4 230.4 486.4 217.6L486.4 217.6z"  ></path><path d="M390.4 505.6c0 19.2 0 32 6.4 51.2 6.4 12.8 12.8 32 25.6 44.8C435.2 608 448 620.8 460.8 627.2 480 633.6 492.8 640 512 640s32 0 51.2-6.4C576 627.2 588.8 614.4 601.6 608c12.8-12.8 25.6-25.6 32-38.4 6.4-12.8 12.8-32 12.8-51.2 0-19.2 0-32-6.4-51.2C633.6 454.4 620.8 441.6 614.4 428.8 601.6 416 588.8 403.2 569.6 396.8 556.8 390.4 537.6 384 524.8 384 505.6 384 492.8 384 473.6 390.4 460.8 396.8 441.6 403.2 435.2 416 422.4 428.8 409.6 441.6 403.2 454.4 396.8 473.6 390.4 486.4 390.4 505.6L390.4 505.6z"  ></path></symbol><symbol id="icon-eye" viewBox="0 0 1024 1024"><path d="M512 240C178.704 240 12.304 483.872 5.376 494.256c-7.168 10.752-7.168 24.752 0 35.504C12.304 540.128 178.704 784 512 784s499.696-243.872 506.624-254.256c7.168-10.752 7.168-24.752 0-35.504C1011.696 483.872 845.296 240 512 240zM512 720C263.888 720 115.744 565.152 72.192 511.936 115.6 458.608 262.976 304 512 304c248.112 0 396.256 154.848 439.808 208.064C908.4 565.392 761.024 720 512 720zM512 368c-79.408 0-144 64.608-144 144s64.592 144 144 144 144-64.608 144-144S591.408 368 512 368zM512 592c-44.112 0-80-35.888-80-80s35.888-80 80-80 80 35.888 80 80S556.112 592 512 592z"  ></path></symbol><symbol id="icon-eye-off" viewBox="0 0 1024 1024"><path d="M962.41027 511.792269 905.058051 443.432345c30.108738-36.255739 55.207369-77.30362 74.140581-122.626875 6.777357-16.22759-0.870834-34.859949-17.098423-41.637306-16.290011-6.797823-34.859949 0.8913-41.637306 17.098423C853.249081 457.180464 696.791703 557.13906 512.148379 557.13906c-186.156794 0-342.67557-100.186793-408.499741-261.452687-6.632047-16.290011-25.181519-24.124444-41.491996-17.450441-16.290011 6.632047-24.103978 25.222451-17.450441 41.49302 19.34765 47.403636 46.134737 90.343611 78.658478 128.121006l-53.6632 63.942311c-11.295254 13.45136-9.534144 33.533744 3.937682 44.850487 5.948479 4.994758 13.223163 7.440459 20.435425 7.440459 9.077749 0 18.114566-3.875261 24.415063-11.378142l49.720402-59.244312c34.487465 30.608112 73.528644 56.220443 115.855658 76.374458l-30.384008 83.471087c-6.031367 16.518209 2.486634 34.777061 19.026332 40.787962 3.585665 1.305739 7.254218 1.927909 10.880815 1.927909 12.994965 0 25.201985-8.020674 29.907147-20.953218l29.694299-81.572854c43.456744 14.417361 89.441055 23.432689 137.125077 26.191522l0 96.624664c0 17.575284 14.258749 31.834033 31.834033 31.834033 17.575284 0 31.834033-14.258749 31.834033-31.834033l0-96.589872c50.570769-2.822278 98.975199-12.387122 144.327106-27.960819l30.326702 83.307358c4.705162 12.932544 16.912182 20.953218 29.907147 20.953218 3.626597 0 7.29515-0.62217 10.880815-1.927909 16.538675-6.009877 25.056676-24.269753 19.026332-40.787962l-31.321356-86.041632c41.663912-20.509103 79.855746-46.515407 113.648386-77.547167l52.844555 62.987566c6.300496 7.502881 15.315824 11.378142 24.415063 11.378142 7.212262 0 14.46648-2.445702 20.435425-7.440459C971.944414 545.326013 973.705524 525.263072 962.41027 511.792269z"  ></path></symbol><symbol id="icon-sqlserver" viewBox="0 0 1024 1024"><path d="M298.337 320.634l-55.116 48.677c-19.402-26.983-39.066-40.39-59.171-40.39-9.789 0-17.726 2.645-23.986 7.849-6.174 5.204-9.347 11.109-9.347 17.726 0 6.525 2.207 12.787 6.702 18.606 6.001 7.849 24.252 24.605 54.587 50.266 28.396 23.723 45.678 38.714 51.677 44.973 15.081 15.254 25.837 29.806 32.099 43.741 6.26 13.933 9.434 29.101 9.434 45.595 0 32.099-11.109 58.641-33.246 79.54-22.223 20.899-51.147 31.396-86.773 31.396-27.868 0-52.116-6.79-72.841-20.46-20.636-13.67-38.359-35.095-53.087-64.375l62.611-37.742c18.783 34.57 40.476 51.852 64.992 51.852 12.787 0 23.547-3.703 32.276-11.2 8.731-7.407 13.052-16.048 13.052-25.837 0-8.907-3.263-17.726-9.877-26.63-6.614-8.907-21.074-22.396-43.387-40.653-42.592-34.745-70.194-61.554-82.627-80.425s-18.606-37.742-18.606-56.527c0-27.158 10.316-50.443 31.042-69.842 20.636-19.402 46.207-29.103 76.545-29.103 19.489 0 38.097 4.499 55.823 13.581 17.542 8.908 36.678 25.398 57.227 49.386v0z" fill="#004198" ></path><path d="M684.673 601.499l68.078 88.006h-88.182l-34.57-44.533c-28.57 15.695-60.495 23.455-95.591 23.455-58.729 0-107.585-20.283-146.474-60.758-38.89-40.476-58.288-88.801-58.288-144.798 0-37.389 9.082-71.783 27.158-103.087s42.945-56.174 74.69-74.605c31.657-18.429 65.699-27.69 102.029-27.69 55.555 0 103.174 20.017 143.035 60.141 39.86 40.036 59.79 88.89 59.79 146.563 0 53.088-17.283 98.765-51.677 137.303v0zM638.197 541.357c15.787-23.371 23.633-49.295 23.633-77.691 0-37.036-12.523-68.518-37.567-94.447-25.044-25.837-55.291-38.799-90.827-38.799-36.595 0-67.194 12.61-91.886 37.742-24.692 25.221-37.036 57.143-37.036 96.031 0 43.297 15.518 77.514 46.651 102.646 24.339 19.663 51.94 29.541 82.893 29.541 17.726 0 34.481-3.44 50.087-10.406l-70.018-90.124h88.801l35.275 45.503z" fill="#004198" ></path><path d="M779.294 267.37h74.426v320.198h108.554v70.99h-182.981v-391.184z" fill="#004198" ></path></symbol><symbol id="icon-db-backup" viewBox="0 0 1024 1024"><path d="M810.666667 149.333333H213.333333c-23.466667 0-42.666667 19.2-42.666666 42.666667v128c0 23.466667 19.2 42.666667 42.666666 42.666667h597.333334c23.466667 0 42.666667-19.2 42.666666-42.666667V192c0-23.466667-19.2-42.666667-42.666666-42.666667zM810.666667 405.333333H213.333333c-23.466667 0-42.666667 19.2-42.666666 42.666667v128c0 23.466667 19.2 42.666667 42.666666 42.666667h597.333334c23.466667 0 42.666667-19.2 42.666666-42.666667v-128c0-23.466667-19.2-42.666667-42.666666-42.666667zM810.666667 661.333333H213.333333c-23.466667 0-42.666667 19.2-42.666666 42.666667v128c0 23.466667 19.2 42.666667 42.666666 42.666667h597.333334c23.466667 0 42.666667-19.2 42.666666-42.666667v-128c0-23.466667-19.2-42.666667-42.666666-42.666667z" fill="#D1C4E9" ></path><path d="M661.333333 640l149.333334 119.466667V520.533333z" fill="#2196F3" ></path><path d="M810.666667 597.333333c-6.4 0-14.933333 0-21.333334 2.133334v85.333333c6.4-2.133333 14.933333-2.133333 21.333334-2.133333 70.4 0 128 57.6 128 128s-57.6 128-128 128-128-57.6-128-128c0-6.4 0-12.8 2.133333-19.2l-72.533333-57.6c-8.533333 23.466667-14.933333 49.066667-14.933334 76.8 0 117.333333 96 213.333333 213.333334 213.333333s213.333333-96 213.333333-213.333333-96-213.333333-213.333333-213.333334z" fill="#2196F3" ></path></symbol><symbol id="icon-oracle" viewBox="0 0 1024 1024"><path d="M682.530598 430.060854c0-60.750385-49.298954-109.998765-110.114363-109.998765h-121.504383c-60.815409 0-110.114363 49.24838-110.114364 109.998765s49.298954 109.998765 110.114364 109.998765h121.504383c60.815409 0 110.114363-49.24838 110.114363-109.998765z m-43.851396 0.484067A66.107632 66.107632 0 0 1 572.539058 496.710352h-121.377948c-36.579557 0-66.425527-29.621999-66.425527-66.165431v-0.60689C384.724746 393.394599 414.570716 363.7726 451.150273 363.7726h121.377947A66.107632 66.107632 0 0 1 638.679202 429.938031v0.60689zM286.466407 652.767714a50.884815 50.884815 0 0 0-50.895652-50.935389H179.51654C151.361191 601.832325 128.241582 624.637652 128.241582 652.767714s23.119609 50.935389 51.274958 50.935389h56.054215A50.884815 50.884815 0 0 0 286.466407 652.767714z m-20.229658 0.451555a30.572071 30.572071 0 0 1-30.579296 30.61542H179.429841c-16.927889 0-30.958602-13.705593-30.958601-30.61542v-0.180622c0-16.909827 14.030713-30.61542 30.958601-30.61542h56.227612a30.572071 30.572071 0 0 1 30.579296 30.61542v0.180622zM377.550442 670.107421c18.690759 0 33.84494-15.284229 33.84494-33.956926s-15.150569-33.956926-33.84494-33.956926H377.138624v0.361244H294.052529v101.14829h20.229658v-80.557388h63.271867a13.185402 13.185402 0 0 1 0 26.370804H319.509386l60.374691 54.186584h28.007239l-40.611038-33.595682h10.270164zM556.492604 703.703103l-60.374692-94.768723c-5.664304-8.908274-18.683534-9.002198-24.347838-0.090311L411.398995 703.703103h24.029943l48.518668-76.096026 25.742239 40.694124h-49.620461l11.462269 16.617219h48.872686l12.058321 18.784683h24.029944zM593.281682 623.145715h58.442037l13.694756-20.952146h-69.983779c-28.093938 0-51.04015 22.978724-51.04015 51.043762 0 28.065038 22.946212 50.458547 51.04015 50.458547h56.289023l13.694756-20.590902h-72.136793c-16.541358 0-30.102454-13.304613-30.102454-29.827908v-0.065024c0-16.516071 13.561096-30.066329 30.102454-30.066329zM694.310761 684.557176v-82.363607h-20.590901v101.509534h95.94999l12.448464-19.145927H694.310761zM796.857065 663.966274h82.150474l12.759134-20.952145h-95.086617c4.194042-11.921048 15.251717-19.868414 28.227598-19.868414h58.196391l12.603799-20.952146h-68.63634c-28.101162 0-51.137685 22.967887-51.137685 51.040149v-0.050574c0 28.072263 23.036523 50.519958 51.137685 50.519959h56.018091l12.603799-20.590902h-70.803803a30.030205 30.030205 0 0 1-28.032526-19.145927z" fill="#d81e06" ></path><path d="M897.586312 255.98826a30.286688 30.286688 0 0 1 30.250564 30.250563v451.518741a30.286688 30.286688 0 0 1-30.250564 30.250564H126.178879a30.286688 30.286688 0 0 1-30.250563-30.250564V286.238823a30.286688 30.286688 0 0 1 30.250563-30.250563h771.407433m0-31.988147H126.178879A62.23871 62.23871 0 0 0 63.940169 286.238823v451.518741a62.23871 62.23871 0 0 0 62.23871 62.238711h771.407433A62.23871 62.23871 0 0 0 959.825022 737.757564V286.238823a62.23871 62.23871 0 0 0-62.23871-62.23871z" fill="#d81e06" ></path></symbol></svg>';var script=function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();var shouldInjectCss=script.getAttribute("data-injectcss");var ready=function(fn){if(document.addEventListener){if(~["complete","loaded","interactive"].indexOf(document.readyState)){setTimeout(fn,0)}else{var loadFn=function(){document.removeEventListener("DOMContentLoaded",loadFn,false);fn()};document.addEventListener("DOMContentLoaded",loadFn,false)}}else if(document.attachEvent){IEContentLoaded(window,fn)}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn()}};var polling=function(){try{d.documentElement.doScroll("left")}catch(e){setTimeout(polling,50);return}init()};polling();d.onreadystatechange=function(){if(d.readyState=="complete"){d.onreadystatechange=null;init()}}}};var before=function(el,target){target.parentNode.insertBefore(el,target)};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild)}else{target.appendChild(el)}};function appendSvg(){var div,svg;div=document.createElement("div");div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName("svg")[0];if(svg){svg.setAttribute("aria-hidden","true");svg.style.position="absolute";svg.style.width=0;svg.style.height=0;svg.style.overflow="hidden";prepend(svg,document.body)}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(e){console&&console.log(e)}}ready(appendSvg)})(window)