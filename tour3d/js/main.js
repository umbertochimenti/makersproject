$(document).ready(function() {
    create_view();
});

function create_view() {
    var view1 = new PANOLENS.ImagePanorama("../img/01.jpeg");
    var view2 = new PANOLENS.ImagePanorama("../img/02.jpeg");
    var viewer = new PANOLENS.Viewer();
    viewer.add(view1);
    viewer.add(view2);
    view1.link( view2, new THREE.Vector3( -3145.23, -3704.40, 1149.48 ) );
    view2.link( view1, new THREE.Vector3( -3429.01, 1205.85, -3421.88 ) );

    view2.link( view1, new THREE.Vector3( -3145.23, -3704.40, 1149.48 ) );
    view1.link( view2, new THREE.Vector3( -3429.01, 1205.85, -3421.88 ) );
}