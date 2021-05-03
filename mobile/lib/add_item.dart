import 'package:flutter/material.dart';
import 'package:mobile/contract.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:flutter/rendering.dart';
import 'dart:typed_data';
import 'dart:ui';
import 'package:path_provider/path_provider.dart';
import 'package:flutter/services.dart';
import 'dart:io';
import 'package:share/share.dart';

class AddItem extends StatelessWidget {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final GlobalKey _qrCodeKey = GlobalKey();
  @override
  Widget build(BuildContext context) {
    final Size screenSize = MediaQuery.of(context).size;
    var contractLink = Provider.of<Contract>(context);
    var itemId;
    TextEditingController itemNameController = TextEditingController();

    return new Scaffold(
      body: new Container(
          padding: new EdgeInsets.all(20.0),
          child: new Form(
            key: this._formKey,
            child: new ListView(
              children: <Widget>[
                new TextFormField(
                    controller: itemNameController,
                    decoration: new InputDecoration(
                        hintText: 'Oranges', labelText: 'Item Name')),
                new Container(
                  width: screenSize.width,
                  child: new RaisedButton(
                    child: new Text(
                      'Add Item',
                      style: new TextStyle(color: Colors.white),
                    ),
                    onPressed: () =>
                        {contractLink.addItem(itemNameController.text)},
                    color: Colors.blue,
                  ),
                  margin: new EdgeInsets.only(top: 20.0),
                ),
                Expanded(
                  child: contractLink.itemId != null
                      ? Center(
                          child: RepaintBoundary(
                              key: _qrCodeKey,
                              child: QrImage(
                                  data: '${contractLink.itemId}', size: 400)),
                        )
                      : Container(),
                ),
                IconButton(
                    icon: Icon(Icons.share), onPressed: _captureAndSharePng)
              ],
            ),
          )),
    );
  }

  Future<void> _captureAndSharePng() async {
    try {
      RenderRepaintBoundary boundary =
          _qrCodeKey.currentContext.findRenderObject();
      var image = await boundary.toImage();
      ByteData byteData = await image.toByteData(format: ImageByteFormat.png);
      Uint8List pngBytes = byteData.buffer.asUint8List();

      Directory tempDir = await getTemporaryDirectory();
      final file = await new File('${tempDir.path}/image.png').create();
      await file.writeAsBytes(pngBytes);
      Share.shareFiles(['${tempDir.path}/image.png'], text: 'Great picture');
    } catch (e) {
      print(e.toString());
    }
  }
}
