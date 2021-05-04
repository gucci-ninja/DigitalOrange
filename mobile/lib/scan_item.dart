import 'dart:io';

import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'package:mobile/contract.dart';
import 'package:provider/provider.dart';

import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:intl/intl.dart';

class QRViewExample extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _QRViewExampleState();
}

class _QRViewExampleState extends State<QRViewExample> {
  Barcode result;
  QRViewController controller;
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');

  // In order to get hot reload to work we need to pause the camera if the platform
  // is android, or resume the camera if the platform is iOS.
  @override
  void reassemble() {
    super.reassemble();
    if (Platform.isAndroid) {
      controller.pauseCamera();
    }
    controller.resumeCamera();
  }

  @override
  Widget build(BuildContext context) {
    var contractLink = Provider.of<Contract>(context);
    return Scaffold(
      body: Column(
        children: <Widget>[
          Expanded(flex: 4, child: _buildQrView(context)),
          Expanded(
            flex: 1,
            child: FittedBox(
              fit: BoxFit.contain,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  if (result != null)
                    Text('Item with id ${result.code} found.')
                  else
                    Text('Scan a QR code'),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: <Widget>[
                      Container(
                        margin: EdgeInsets.all(8),
                        child: ElevatedButton(
                          onPressed: () async {
                            await contractLink.updateItem(result.code);
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => TestMapPolyline(
                                      contractLink.itemName,
                                      contractLink.locations,
                                      contractLink.dates)),
                            );
                          },
                          child:
                              Text('View Item', style: TextStyle(fontSize: 20)),
                        ),
                      )
                    ],
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildQrView(BuildContext context) {
    // For this example we check how width or tall the device is and change the scanArea and overlay accordingly.
    var scanArea = (MediaQuery.of(context).size.width < 400 ||
            MediaQuery.of(context).size.height < 400)
        ? 150.0
        : 300.0;
    // To ensure the Scanner view is properly sizes after rotation
    // we need to listen for Flutter SizeChanged notification and update controller
    return QRView(
      key: qrKey,
      onQRViewCreated: _onQRViewCreated,
      overlay: QrScannerOverlayShape(
          borderColor: Colors.red,
          borderRadius: 10,
          borderLength: 30,
          borderWidth: 10,
          cutOutSize: scanArea),
    );
  }

  void _onQRViewCreated(QRViewController controller) {
    setState(() {
      this.controller = controller;
    });
    controller.scannedDataStream.listen((scanData) {
      setState(() {
        result = scanData;
      });
    });
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }
}

class TestMapPolyline extends StatefulWidget {
  final String itemName;
  final List<dynamic> locations;
  final List<dynamic> dates;

  const TestMapPolyline(this.itemName, this.locations, this.dates);
  @override
  _TestMapPolylineState createState() =>
      _TestMapPolylineState(itemName, locations, dates);
}

class _TestMapPolylineState extends State<TestMapPolyline> {
  String itemName;
  List<dynamic> locations;
  List<dynamic> dates;

  _TestMapPolylineState(this.itemName, this.locations, this.dates);

  final Set<Marker> _markers = {};
  final Set<Polyline> _polyline = {};

  GoogleMapController controller;

  List<LatLng> route = List();

  @override
  void initState() {
    super.initState();
    //line segment 1
    for (String location in locations) {
      var latlng = location.split(",");
      route.add(LatLng(double.parse(latlng[0]), double.parse(latlng[1])));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: widget.itemName != null
            ? Text("History for ${widget.itemName}")
            : Text('Digital Orange'),
      ),
      body: GoogleMap(
        //that needs a list<Polyline>
        polylines: _polyline,
        markers: _markers,
        onMapCreated: _onMapCreated,
        initialCameraPosition: CameraPosition(
          target: route.last,
          zoom: 11.0,
        ),
        mapType: MapType.normal,
      ),
    );
  }

  void _onMapCreated(GoogleMapController controllerParam) {
    setState(() {
      controller = controllerParam;
      for (var i = 0; i < route.length; i++) {
        DateTime timedate = new DateTime.fromMicrosecondsSinceEpoch(
            int.parse(widget.dates[i]) * 1000);
        String formattedDate =
            DateFormat('yyyy-MM-dd – kk:mm').format(timedate);
        _markers.add(Marker(
          // This marker id can be anything that uniquely identifies each marker.
          markerId: MarkerId(route[i].toString()),
          //_lastMapPosition is any coordinate which should be your default
          //position when map opens up
          position: route[i],
          infoWindow: InfoWindow(
            title: 'Scanned on: $formattedDate',
            snippet: widget.locations[i],
          ),
        ));
      }

      _polyline.add(Polyline(
        polylineId: PolylineId('line1'),
        visible: true,
        //latlng is List<LatLng>
        points: route,
        width: 2,
        color: Colors.blue,
      ));
    });
  }
}
