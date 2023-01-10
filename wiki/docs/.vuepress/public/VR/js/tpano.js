function TPano(d) {
    //选取渲染对象的根dom
    let el = document.getElementById(d.el);
    var width = el.clientWidth;
    var height = el.clientHeight;

    //参数处理
    if (d.DeviceOrientationControls == null) {
        d.DeviceOrientationControls = false;
    }
    if (d.MouseController == null) {
        d.MouseController = true;
    }

    //初始化场景、相机、渲染器
    const scene = new THREE.Scene();
    let fov;
    if (el.clientWidth <= 700 || el.clientWidth < el.clientHeight) {
        //手机端视角
        fov = 90;
    } else {
        //pc端视角
        fov = 60;
    }
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);//创建相机
    //camera.lookAt(500, 0, 0);//视角矫正
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x272727, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    el.append(renderer.domElement);


    //生成全景图片3D对象
    const geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    geometry.scale(- 1, 1, 1);
    let mesh = new THREE.Mesh(geometry);
    scene.add(mesh);
    var texture = Array();
    let loadTextureLoaderCount = 0;
    loadTextureLoader(loadTextureLoaderCount);
    //用来加载全景照片
    function loadTextureLoader(i) {
        if (d.photo[i].type == 'VIDEO') {
            el.insertAdjacentHTML('beforeend','<video id="video-'+i+'" loop muted style="display: none;" crossOrigin="anonymous" playsinline ><source src="'+ d.photo[i].url +'"></video>');
            let videoId = 'video-'+i;
            let videoDom = document.getElementById(videoId);
            videoDom.play();
            texture[i] = new THREE.VideoTexture( videoDom );
            //没有找到监听加载的办法，暂时使用延迟模拟回调
            setTimeout(() => {
                loadTextureLoaderEnd();
            }, 2000);
        } else {
            texture[i] = new THREE.TextureLoader().load(
                d.photo[i].url,
                // onLoad回调
                function () {
                    loadTextureLoaderEnd();
                },

                // 目前暂不支持onProgress的回调
                function (e) {
                    console.log(e);
                },

                // onError回调
                function (err) {
                    console.error('An error happened.');
                }
            );
        }
    }
    //用来控制加载下一张全景照片
    var loadTextureMsg;
    function loadTextureLoaderEnd() {
        let i = loadTextureLoaderCount;
        console.log(texture);
        texture[i].panoName = d.photo[i].name;
        loadTextureMsg = {
            'all': d.photo.length,
            'loading': {
                id: i + 1,
                name: d.photo[i].name
            },
            'Leftover': d.photo.length - i - 1
        };
        if (d.photoLoad != null) {
            d.photoLoad(loadTextureMsg);
        }
        if (loadTextureLoaderCount == 0) {
            //初始化加载第一张图片
            switchPhotoN(0);
        }
        if (loadTextureLoaderCount < d.photo.length - 1) {
            loadTextureLoader(++loadTextureLoaderCount);
        }
    }

    /**
     * 切换全景照片
     * @param int i 选择照片张数
     * @return json status，正常返回OK，不正常返回ERROR；msg具体信息
     */
    function switchPhotoN(i) {
        let response = {
            status: 'ERROR',
            msg: '系统出错'
        }

        if (i < d.photo.length && i >= 0) {
            //回调通知：注意全景图片换页事件开始，应该检查全景图片是否下载完毕，主要是用于做进度提示功能
            if (loadTextureMsg.all - loadTextureMsg.Leftover >= i + 1) {
                //已加载完成，无需等待
                if (d.switchLoad != null) {
                    d.switchLoad({
                        loading: {
                            id: i + 1,
                            name: d.photo[i].name
                        },
                        status: 'end'
                    });
                }
                switchGo();
            } else {
                //未加载完成，请等待一秒后再尝试
                if (d.switchLoad != null) {
                    d.switchLoad({
                        loading: {
                            id: i + 1,
                            name: d.photo[i].name
                        },
                        status: 'loading'
                    });
                }
                setTimeout(switchPhotoN, 1000, i);
            }

            function switchGo() {
                let fov;
                if (el.clientWidth <= 700 || el.clientWidth < el.clientHeight) {
                    //手机端视角
                    try {
                        fov = d.photo[i].fov.phone;
                    } catch (error) {
                        fov = null;
                    }
                } else {
                    //pc端视角
                    try {
                        fov = d.photo[i].fov.pc;
                    } catch (error) {
                        fov = null;
                    }
                }
                if (fov != null) {
                    camera.fov = fov;
                    camera.updateProjectionMatrix();
                } else {
                    if (el.clientWidth <= 700 || el.clientWidth < el.clientHeight) {
                        //手机端视角
                        fov = 90;
                    } else {
                        //pc端视角
                        fov = 60;
                    }
                    camera.fov = fov;
                    camera.updateProjectionMatrix();
                }
                console.log(texture);
                material = new THREE.MeshBasicMaterial({ map: texture[i] });
                mesh.material = material;
                cleanHotspot();
                if (d.hotspot != null) {
                    initHotspot();
                }
                response = {
                    status: 'OK',
                    msg: '切换成功'
                }
            }

        } else {
            response.msg = '无效的照片索引';
        }

        return response;
    }

    //生成热点
    let hotspotAnimate_count = 1;
    let hotspotAnimate_temp = Array();
    function initHotspot() {
        for (let j = 0; j < d.hotspot.length; j++) {
            if (mesh.material.map.panoName == d.hotspot[j].source) {
                let map = new THREE.TextureLoader().load(d.hotspot[j].imgUrl);
                let material = new THREE.SpriteMaterial({ map: map });

                let sprite = new THREE.Sprite(material);
                sprite.position.set(d.hotspot[j].position.x * 0.9, d.hotspot[j].position.y * 0.9, d.hotspot[j].position.z * 0.9);
                sprite.scale.set(30, 30, 1);
                for (let k = 0; k < d.photo.length; k++) {
                    if (d.photo[k].name == d.hotspot[j].jumpTo) {
                        sprite.jumpTo = k;
                    }
                }
                sprite.name = 'hotspot';
                scene.add(sprite);
            }
        }

        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name == 'hotspot') {
                hotspotAnimate_temp[i] = scene.children[i].position.y;
            }
        }
    }

    //清除热点
    function cleanHotspot() {
        let children = scene.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].name == 'hotspot') {
                scene.children.splice(i, 1);
                i--;//从一个数组中去掉一个元素会使得后面的元素下标前移1，所以下一个遍历的元素下标也需要减一，避免漏网之鱼
            }
        }
    }

    //体感控制
    let devicecontrol
    try {
        devicecontrol = new THREE.DeviceOrientationControls(camera);
    } catch (error) {
        devicecontrol = null;
    }

    //启动鼠标控制
    mouseController();
    //启动多点触控
    phoneController();

    //动画绑定
    function animate() {
        requestAnimationFrame(animate);

        //热点摆动
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name == 'hotspot') {

                if (hotspotAnimate_count >= 400) {
                    hotspotAnimate_count = 1;
                    scene.children[i].position.y = hotspotAnimate_temp[i];
                }

                if (hotspotAnimate_count <= 200) {
                    scene.children[i].position.y = scene.children[i].position.y + 0.04;
                } else {
                    scene.children[i].position.y = scene.children[i].position.y - 0.04;
                }

                hotspotAnimate_count++;
            }
        }

        render();
    }
    animate();

    //镜头自由旋转
    let anglexoz = -90;//相机在xoz平面上的角度
    var rotateAnimateController = d.rotateAnimateController;
    function rotateAnimate() {
        if (rotateAnimateController == true && d.DeviceOrientationControls == false) {
            anglexoz += 0.1;
            if (anglexoz > 360) {
                anglexoz = 0;
            }
            let x = Math.cos(anglexoz * Math.PI / 180) * 500;
            let z = Math.sin(anglexoz * Math.PI / 180) * 500;
            camera.lookAt(x, 0, z);
            //console.log(anglexoz);
        }
    }
    setInterval(rotateAnimate, 1000 / 60);//60帧

    el.addEventListener('pointerdown', function () {
        if (d.MouseController) {
            rotateAnimateController = false;
        }
    });

    //手机端多点触控
    let mouseFovControllerSport = true;//用来开闭鼠标控制支持的，如果用户在进行放大手势，应该将鼠标视角控制锁定
    function phoneController() {
        let oldL = 0;
        let x1, x2, y1, y2, l;
        document.addEventListener('touchstart', function (event) {
            if (!d.MouseController) {
                return;
            }
            if (event.touches.length == 2) {
                mouseFovControllerSport = false;
                x1 = event.touches[0].clientX;
                x2 = event.touches[1].clientX;
                y1 = event.touches[0].clientY;
                y2 = event.touches[1].clientY;
                oldL = Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2));//求两点间长度
            } else {
                mouseFovControllerSport = true;
            }
        }, false);
        document.addEventListener('touchmove', function (event) {
            if (!d.MouseController) {
                return;
            }
            event.preventDefault(); // prevent scrolling
            event.stopPropagation();
            if (event.touches.length == 2) {
                x1 = event.touches[0].clientX;
                x2 = event.touches[1].clientX;
                y1 = event.touches[0].clientY;
                y2 = event.touches[1].clientY;

                l = Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2));//求两点间长度

                let lAdd = l - oldL;//长度增量
                oldL = l;

                console.log(lAdd);
                const fov = camera.fov - lAdd * 0.3;
                camera.fov = THREE.MathUtils.clamp(fov, 10, 90);
                camera.updateProjectionMatrix();
            }

        }, false);
    }

    //封装鼠标控制
    function mouseController() {

        //初始化鼠标控制用变量
        let isUserInteracting = false,
            onPointerDownMouseX = 0, onPointerDownMouseY = 0,
            lon = -90, onPointerDownLon = 0,
            lat = 0, onPointerDownLat = 0,
            phi = 0, theta = 0;

        //鼠标控制视角、响应热点交互
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        function onMouseMove(event) {
            if (!d.MouseController) {
                return;
            }
            // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
            mouse.x = (event.clientX / el.clientWidth) * 2 - 1;
            mouse.y = - (event.clientY / el.clientHeight) * 2 + 1;
            render();
        }

        //鼠标按下到松开期间有没有移动，如果没有移动说明点击的是热点，否则是移动视角
        let clientX, clientY;
        el.addEventListener('pointerdown', function (event) {
            if (!d.MouseController) {
                return;
            }
            clientX = event.clientX;
            clientY = event.clientY;
        });
        el.addEventListener('pointerup', function (event) {
            if (!d.MouseController) {
                return;
            }
            var distance = Math.sqrt(Math.pow(Math.abs(event.clientX - clientX), 2) + Math.pow(Math.abs(event.clientY - clientY), 2));//鼠标按下到松开期间移动距离
            if (distance <= 10) {
                //这是个容差设计，在手机端如果不给差值，很可能用户的点击和松开之间会有误差
                positionClick();
            }
        });

        //获取点击坐标，拾取点击对象
        function positionClick() {
            // 通过摄像机和鼠标位置更新射线
            raycaster.setFromCamera(mouse, camera);
            // 计算物体和射线的交点
            const intersects = raycaster.intersectObjects(scene.children);
            for (let i = 0; i < intersects.length; i++) {
                if (d.debug == true) {
                    console.log('点击坐标：', intersects[i].point);
                }
                //检测点击热点是否跳转场地
                if (intersects[i].object.jumpTo != null && i == 0) {
                    switchPhotoN(intersects[i].object.jumpTo);
                    console.log(scene);
                }
            }
        }

        el.style.touchAction = 'none';
        el.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('wheel', onDocumentMouseWheel);
        //计算摄像机目前视角状态，保持当前状态，在当前状态上附加变化
        lon = -1 * THREE.MathUtils.radToDeg(camera.rotation.y) - 90;//经度
        lat = THREE.MathUtils.radToDeg(camera.rotation.x);//纬度
        function onPointerDown(event) {
            if (!d.MouseController) {
                return;
            }

            //console.log(camera);

            onMouseMove(event);
            if (event.isPrimary === false) return;
            isUserInteracting = true;

            onPointerDownMouseX = event.clientX;
            onPointerDownMouseY = event.clientY;

            onPointerDownLon = lon;
            onPointerDownLat = lat;

            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);
        }

        function onPointerMove(event) {
            if (!d.MouseController) {
                return;
            }
            if (event.isPrimary === false) return;
            let rate;//触控灵敏度
            //想写个函数来线性计算这里的灵敏度，暂时没找到合适的函数
            if (el.clientWidth <= 700 || el.clientWidth < el.clientHeight) {
                //判断为手机
                rate = 0.4;
            } else {
                //判断为电脑
                rate = 0.1;
            }

            //缩放视角时 暂停相机旋转
            if (mouseFovControllerSport) {
                lon = (onPointerDownMouseX - event.clientX) * rate + onPointerDownLon;
                //console.log('calc0:'+onPointerDownLat);
                lat = (event.clientY - onPointerDownMouseY) * rate + onPointerDownLat;
                //console.log('calc1:'+lat);
                update();
            }
        }

        function onPointerUp() {
            if (!d.MouseController) {
                return;
            }
            if (event.isPrimary === false) return;
            isUserInteracting = false;
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        }

        function onDocumentMouseWheel(event) {
            if (!d.MouseController) {
                return;
            }
            const fov = camera.fov + event.deltaY * 0.05;
            camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
            camera.updateProjectionMatrix();
        }

        function update() {
            if (isUserInteracting === false) {
                //lon += 0.1;
            }
            //console.log('lon->' + lon, 'lat->' + lat);
            lat = Math.max(- 85, Math.min(85, lat));
            phi = THREE.MathUtils.degToRad(90 - lat);
            theta = THREE.MathUtils.degToRad(lon);
            const x = 500 * Math.sin(phi) * Math.cos(theta);
            const y = 500 * Math.cos(phi);
            const z = 500 * Math.sin(phi) * Math.sin(theta);
            //console.log('x=' + x + 'y=' + y + 'z=' + z);
            //console.log('x=' + THREE.MathUtils.radToDeg(camera.rotation.x), 'y=' + THREE.MathUtils.radToDeg(camera.rotation.y));
            camera.lookAt(x, y, z);
        }
    }

    //渲染
    function render() {
        if (d.DeviceOrientationControls == true) {
            //检测陀螺仪状态，比如电脑不支持陀螺仪，回调一个消息告诉前台
            if (camera.rotation._x == -1.5707963267948966 && camera.rotation._y == 0 && camera.rotation._z == 0) {
                //当相机对准这个坐标表示很可能设备不支持陀螺仪
                d.gyroSport(false);
            } else {
                d.gyroSport(true);
            }
            devicecontrol.update();
        }
        renderer.render(scene, camera);
    }

    //创建外部访问接口函数
    this.re = {
        /**
         * 宽高重设
         * @param doble width 宽度
         * @param double height 高度
         */
        resizeRendererToDisplaySize: function resizeRendererToDisplaySize(width, height) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
            el.style.width = width + 'px';
            el.style.height = height + 'px';
            renderer.domElement.style.width = width + 'px';
            renderer.domElement.style.height = height + 'px';
        },
        /**
         * 全景照片切换函数
         * 该函数执行不一定能立刻切换，可能因为照片没有下载完毕不能切换，请于开发文档关注此方法的回调函数
         * @param int i 需要切换哪张照片
         */
        switchPhoto: function switchPhoto(i) {
            return switchPhotoN(i - 1);
        },
        /**
         * 切换体感
         * @param bool e 体感控制开关，true表示打开，false表示关闭
         */
        switchGyro: function switchGyro(e) {
            d.DeviceOrientationControls = e;
        },

        /**
         * 切换鼠标控制
         * @param bool e 鼠标控制开关
         */
        seitchMouseController: function seitchMouseController(e) {
            d.MouseController = e;
        }
    }
}