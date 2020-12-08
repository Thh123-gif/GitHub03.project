//��װ��ȡԪ�ط���
function query(selector) {
	//selector: cssѡ����

	return document.querySelector(selector);
}

//��װ���¼�����(���Ǽ�����)
function addEvent(element, type, fn, isCapture){
	isCapture = isCapture ? true : false;

	//��IE8����IE8���µ���������¼�
	if (window.addEventListener) {
		element.addEventListener(type, fn, isCapture);
	} else {
		//IE8����IE8���µ���������¼�
		element.attachEvent('on' + type, fn);
	}
}

//��ȡ��ʼ��Ϸ��ť
var begin = query('#begin');

//��ȡ��ʼ��Ϸ����Ԫ��
var start = query('#start');

//��ȡ��Ϸ����Ԫ��
var game = query('#game');

//��ȡ��Ϸ������Ԫ��
var plane = query('#plane');

//��ȡ��Ϸ������Ԫ�ؼ������ʽ
var planeStyle = window.getComputedStyle(plane);

//��ȡ��Ϸ������Ԫ�ؼ������ʽ�Ŀ��
var planeWidth = parseInt(planeStyle.width);

//��ȡ��Ϸ������Ԫ�ؼ������ʽ�ĸ߶�
var planeHeight = parseInt(planeStyle.height);

//��ȡ�ҷ��ɻ���Ԫ��
var myplane = query('#myplane');
var myplaneStyle  = window.getComputedStyle(myplane);
var myplaneWidth = parseInt(myplaneStyle.width);
var myplaneHeight = parseInt(myplaneStyle.height);

//��ȡ��Ϸ����layer������ƶ��¼���Ԫ��
var layer = query('#layer');


//�ƶ�������ʱ�����
var moveBgTimer = null;

//�����ӵ�ʵ����ʱ�����
var bulletTimer = null;

//�ƶ��ӵ�ʵ����ʱ�����
var moveBulletTimer = null;

//���ɵл�ʵ����ʱ�����
var enemyPlaneTimer = null;

//�ƶ��л�ʵ����ʱ�����
var moveEnemyPlaneTimer = null;

//�ƶ���Ϸ����
function moveGameBg() {
	//��ȡ��������Ԫ��
	var bgs = document.getElementsByClassName('bg');

	//������ʱ���ƶ�����
	moveBgTimer = setInterval(function () {
		for (var i = 0; i < bgs.length; i++) {
			//��ȡ��ǰ����Ԫ�ص�top
			var currentTop = parseInt(window.getComputedStyle(bgs[i]).top);
			//ÿһ���ƶ�2������
			currentTop += 2;

			//�����ǰ��Ԫ��topֵ������Ϸ������߶�, ����ǰ��Ԫ��topֵ����Ϊ -planeHeight
			if (currentTop >= planeHeight) {
				currentTop = -planeHeight;
			}

			//�ƶ�����
			bgs[i].style.top = currentTop + 'px';

		}
	}, 50);

}

//�ƶ��ҷ��л�
function myPlane(e) {

	//e: �¼�����
	//��ȡ�������
	var x = e.offsetX;
	var y = e.offsetY;

	//�ҷ��ɻ������ƶ���Χ
	var maxX = planeWidth - myplaneWidth;
	var minX = 0;

	//�ҷ��ɻ������ƶ���Χ
	var maxY = planeHeight - myplaneHeight;
	var minY = 0;

	//�ҷ��ɻ��ƶ�����
	var x0 = x - myplaneWidth / 2;
	var y0 = y - myplaneHeight / 2;

	//�����ҷ��ɻ��ƶ���Χ
	x0 = x0 > maxX ? maxX : x0 < minX ? minX : x0;
	y0 = y0 > maxY ? maxY : y0 < minY ? minY : y0;

	//�ƶ��ҷ��ɻ�
	myplane.style.left = x0 + 'px';
	myplane.style.top = y0 + 'px';

}

//�����ӵ���

//�ӵ�ʵ��
var bullet; 

//�ӵ���
function Bullet() {
	//�ӵ���Ⱥ͸߶�
	this.bulletWidth = 6;
	this.bulletHeight = 14;

	//�ӵ��ƶ�����
	this.bulletX = 0;
	this.bulletY = 0;

	//�ӵ�DOMԪ��
	this.currentBullet = null;

	//�ӵ�ͼƬ·��
	this.bulletSrc = './images/bullet.png';
}

//�����ӵ�
Bullet.prototype.createBullet = function () {

	//�����ӵ�ͼƬԪ��
	this.currentBullet = document.createElement('img');

	//�����ӵ�ͼƬ��Դ
	this.currentBullet.src = this.bulletSrc;

	this.currentBullet.style.position = 'absolute';
	this.currentBullet.style.zIndex = 2;
	this.currentBullet.style.width = this.bulletWidth;
	this.currentBullet.style.height = this.bulletHeight;

	//��ȡ�ҷ��ɻ�����
	var myplaneX = parseInt(myplane.style.left);
	var myplaneY = parseInt(myplane.style.top);

	//�����ӵ�����
	this.bulletX = myplaneX + myplaneWidth / 2 - this.bulletWidth / 2;
	this.bulletY = myplaneY - this.bulletHeight;

	//�����ӵ�����
	this.currentBullet.style.left = this.bulletX + 'px';
	this.currentBullet.style.top = this.bulletY + 'px';

	//���ӵ�DOM�������Ϸ����Ԫ��game��
	game.appendChild(this.currentBullet);

}

//�ƶ��ӵ�
Bullet.prototype.moveBullet = function (bullets, index) {
	//bullets: �ӵ�ʵ������
	//index: �ӵ�ʵ������

	//ÿһ���ƶ�һ������
	this.bulletY -= 2;

	if (this.bulletY <= 0) {
		//�Ƴ��ӵ�DOMԪ��
		this.currentBullet.remove();

		//���ӵ�ʵ�������Ƴ���ǰ�ӵ�ʵ��
		bullets.splice(index, 1);
	} else {
		//�ƶ��ӵ�
		this.currentBullet.style.top = this.bulletY + 'px';
	}
}

//�ӵ���ײ�л�
Bullet.prototype.shootEnemyPlane = function (bullets, enemyPlanes, index) {
	//�ӵ���ײ�л�����
	//ÿһ���ӵ�ʵ������Ҫ�������ел�ʵ��
	for (var i = 0; i < enemyPlanes.length; i++) {
		//�ӵ���ײ�л�
		if (this.bulletX >= enemyPlanes[i].enemyPlaneX - this.bulletWidth && this.bulletX <= enemyPlanes[i].enemyPlaneX + enemyPlanes[i].enemyPlaneWidth && this.bulletY >= enemyPlanes[i].enemyPlaneY - this.bulletHeight && this.bulletY <= enemyPlanes[i].enemyPlaneY + enemyPlanes[i].enemyPlaneHeight) {
			//���ٵл���Ѫ��
			enemyPlanes[i].enemyPlaneBlood -= 1;

			//����л���Ѫ��Ϊ0, ��Ҫ�Ƴ��л�DOM, ���Ҵӵл�ʵ�������Ƴ���ǰ�л�
			if (enemyPlanes[i].enemyPlaneBlood <= 0) {

				//�����л���ըͼ
				var boomEnemyPlane = document.createElement('img');
				boomEnemyPlane.src = enemyPlanes[i].enemyPlaneDieSrc;
				boomEnemyPlane.style.width = enemyPlanes[i].enemyPlaneWidth + 'px';
				boomEnemyPlane.style.height = enemyPlanes[i].enemyPlaneHeight + 'px';
				boomEnemyPlane.style.position = 'absolute';
				boomEnemyPlane.style.zIndex = 3;
				boomEnemyPlane.style.left = enemyPlanes[i].enemyPlaneX + 'px';
				boomEnemyPlane.style.top = enemyPlanes[i].enemyPlaneY + 'px';

				//�Ƴ��л�DOM
				enemyPlanes[i].currentEnemyPlane.remove();

				//�ӵл�ʵ�������Ƴ���ǰ�л�
				enemyPlanes.splice(i, 1);

				game.appendChild(boomEnemyPlane);

				(function (element) {
					setTimeout(function () {
						//�Ƴ���ը�л�DOM
						boomEnemyPlane.remove();
					}, 400)
				})(boomEnemyPlane);

			}

			//�Ƴ���ײ�л����ӵ�
			this.currentBullet.remove();

			//���ӵ�ʵ�������Ƴ���ǰ�ӵ�
			bullets.splice(index, 1);

		}
	}
}

//�����ӵ�ʵ������
var bullets = [];

//�����ӵ�ʵ��
function createEveryBullet() {
	//ÿ100ms�����ӵ�
	bulletTimer = setInterval(function () {
		//�����ӵ��๹���ӵ�ʵ��
		bullet = new Bullet();

		//���ô����ӵ�ʵ������
		bullet.createBullet();

		//�����ӵ�ʵ��
		bullets.push(bullet);
	}, 300)
}

//�ƶ�ÿһ���ӵ�ʵ��
function moveEveryBullet() {

	moveBulletTimer = setInterval(function () {
		//��������ӵ�ʵ��, �����ӵ��ƶ�
		if (bullets.length == 0) {return;}

		for (var i = 0; i < bullets.length; i++) {
			//ÿһ���ӵ�ʵ�� bullets[i]
			bullets[i].moveBullet(bullets, i);

			//�����ǰ�ӵ�������, ���ؼ���ӵ���ײ�л�
			if (bullets[i] == undefined) {return;}

			//���ڵл�, ��Ҫ�ж��ӵ��Ƿ���ײ�л�
			bullets[i].shootEnemyPlane(bullets, enemyPlanes, i);

		}

	}, 5)
}

//�л�����
var enemy = [
	{img: './images/enemy1.png', dieImg: './images/enemy1b.gif', width: 34, height: 24, blood: 1},
	{img: './images/enemy2.png', dieImg: './images/enemy2b.gif', width: 46, height: 60, blood: 5},
	{img: './images/enemy3.png', dieImg: './images/enemy3b.gif', width: 110, height: 164, blood: 10}
];

//�����л�
//�л�ʵ��
var enemyPlane;

//�����л���
function EnemyPlane() {

	//���ݵл����ݴ�����Ӧ�ĵл�
	var emy = null;
	//0-0.5����С�͵л�
	//0.5-0.9�������͵л�
	//0.9-1���ɴ��͵л�
	var random = Math.random();
	if (random <= 0.5) {
		emy = enemy[0]; //С�͵л�
	} else if (random <= 0.9) {
		emy = enemy[1]; //���͵л�
	} else {
		emy = enemy[2]; //���͵л�
	}

	//�л���Ⱥ͸߶�
	this.enemyPlaneWidth = emy.width;
	this.enemyPlaneHeight = emy.height;

	//������ɵл���������, ��������
	this.enemyPlaneX = Math.random() * (planeWidth - this.enemyPlaneWidth);
	this.enemyPlaneY = -this.enemyPlaneHeight;

	//�л�ͼƬ·��
	this.enemyPlaneSrc = emy.img;

	//�л���ըͼƬ·��
	this.enemyPlaneDieSrc = emy.dieImg;

	//�л�Ѫ��
	this.enemyPlaneBlood = emy.blood;

	//�л�DOMԪ��
	this.currentEnemyPlane = null;

}

//�����л�
EnemyPlane.prototype.createEnemeyPlane = function () {
	//�����л�DOM
	this.currentEnemyPlane = document.createElement('img');
	this.currentEnemyPlane.src = this.enemyPlaneSrc;
	this.currentEnemyPlane.style.width = this.enemyPlaneWidth + 'px';
	this.currentEnemyPlane.style.height = this.enemyPlaneHeight + 'px';

	this.currentEnemyPlane.style.position = 'absolute';
	this.currentEnemyPlane.style.zIndex = 3;

	this.currentEnemyPlane.style.left = this.enemyPlaneX + 'px';
	this.currentEnemyPlane.style.top = this.enemyPlaneY + 'px';

	game.appendChild(this.currentEnemyPlane);
}

//�ƶ��л�
EnemyPlane.prototype.moveEnemeyPlane = function (enemyPlanes, index) {
	//enemyPlanes: �л�ʵ������
	//index: �л�ʵ������
	this.enemyPlaneY += 2;
	if (this.enemyPlaneY >= planeHeight + this.enemyPlaneHeight) {
		//�Ƴ��л�DOM
		this.currentEnemyPlane.remove();

		//�ӵл�ʵ�������Ƴ���ǰ�л�
		enemyPlanes.splice(index, 1);

	} else {

		//�ƶ��л�
		this.currentEnemyPlane.style.top = this.enemyPlaneY + 'px';

	}

}

//����л�ʵ������
var enemyPlanes = [];

//����ÿһ�ܵл�
function createEveryEnemyPlane() {
	enemyPlaneTimer = setInterval(function () {
		//�л�ʵ��
		enemyPlane = new EnemyPlane();

		//�����л�ʵ��
		enemyPlane.createEnemeyPlane();

		//����л�ʵ��
		enemyPlanes.push(enemyPlane);

	}, 1500)
}

//�ƶ�ÿһ�ܵл�
function moveEveryEnemyPlane() {
	moveEnemyPlaneTimer = setInterval(function () {
		//�������л�ʵ��, ���صл��ƶ�
		if (enemyPlanes.length == 0) {return;}

		//��ȡ�ҷ��ɻ�������
		var myplaneX = parseInt(myplane.style.left);
		var myplaneY = parseInt(myplane.style.top);

		//�����ƶ�ÿһ�ܵл�ʵ��
		for (var i = 0; i < enemyPlanes.length; i++) {
			//�ƶ��л�, ÿһ�ܵл���ʵ�� enemyPlanes[i]
			enemyPlanes[i].moveEnemeyPlane(enemyPlanes, i);

			//�жϵл��Ƿ���ײ�ҷ��ɻ�
			if (enemyPlanes[i].enemyPlaneX >= myplaneX - enemyPlanes[i].enemyPlaneWidth && enemyPlanes[i].enemyPlaneX <= myplaneX + myplaneWidth && enemyPlanes[i].enemyPlaneY >= myplaneY - enemyPlanes[i].enemyPlaneHeight && enemyPlanes[i].enemyPlaneY <= myplaneY + myplaneHeight) {

				myplane.querySelector('img').src = './images/planeb.gif';

				//������ж�ʱ��
				clearInterval(moveBgTimer);
				moveBgTimer = null;
				clearInterval(bulletTimer);
				bulletTimer = null;
				clearInterval(moveBulletTimer);
				moveBulletTimer = null;
				clearInterval(enemyPlaneTimer);
				enemyPlaneTimer = null;
				clearInterval(moveEnemyPlaneTimer);
				moveEnemyPlaneTimer = null;

				layer.onmousemove = null;
				layer.onmouseenter = null;

				console.log('��Ϸ����');

				var imgs = plane.querySelectorAll('#game>img');
				for (var i = 0; i < imgs.length; i++) {
					imgs[i].remove();
				}

				enemyPlanes = []
				bullets = []

				setTimeout(function () {
					myplane.querySelector('img').src = './images/plane.gif';
					myplane.style.left = 0 + 'px';
					myplane.style.top = 607 + 'px';

					game.style.display = 'none';
					start.style.display = 'block';
				}, 2000);

			}

		}

	}, 20)
}


//��ʼ����Ϸ
function initGame() {
	//Ϊ��ʼ��Ϸ��ť�󶨵���¼�
	addEvent(begin, 'click', function () {
		//���ؿ�ʼ��Ϸ����Ԫ��
		start.style.display = 'none';

		//��ʾ��Ϸ����Ԫ��
		game.style.display = 'block';

		//��Ϸ����layer������ƶ�onmousemove�¼�
		// addEvent(layer, 'mousemove', function (e) {
		// 	//�ƶ��ҷ��ɻ�
		// 	myPlane(e);
		// })

		//��Ϸ����layer������ƶ�onmouseenter�¼�
		// addEvent(layer, 'mouseenter', function (e) {
		// 	//�ƶ��ҷ��ɻ�
		// 	myPlane(e);
		// })

		layer.onmousemove = function (e) {
			myPlane(e);
		}

		layer.onmouseenter = function (e) {
			myPlane(e);
		}


		//�ƶ���Ϸ����
		moveGameBg();

		//�����ӵ�
		createEveryBullet();

		//�ƶ��ӵ�
		moveEveryBullet();

		//���ɵл�
		createEveryEnemyPlane();

		//�ƶ��л�
		moveEveryEnemyPlane();

	})

}

//ҳ�������ɴ����¼�
window.onload = function () {
	//��ʼ����Ϸ
	initGame();
}
